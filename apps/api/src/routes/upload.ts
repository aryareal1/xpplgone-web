import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Readable } from 'node:stream';
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import Elysia, { t } from 'elysia';
import auth from '../middleware/auth';
import { r } from '../schema';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  forcePathStyle: true, // required for MinIO path-style addressing
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  // Streams + checksum chunked-encoding conflict on MinIO ("x-amz-decoded-content-length: undefined").
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

const bucket = process.env.S3_BUCKET!;

/** Lazily create the bucket once on first use. */
let bucketReady: Promise<void> | null = null;
function ensureBucket(): Promise<void> {
  if (bucketReady) return bucketReady;

  bucketReady = (async () => {
    try {
      await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    }
  })();

  return bucketReady;
}

export default new Elysia({
  prefix: '/upload',
  detail: { tags: ['Upload'] },
})
  .use(auth)
  .post(
    '/',
    async ({ body, status }) => {
      const { file } = body;
      await ensureBucket();

      const key = `${randomUUID()}${extname(file.name)}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          // Stream the upload to MinIO instead of buffering it in memory.
          Body: Readable.fromWeb(file.stream() as never),
          ContentLength: file.size,
          ContentType: file.type || undefined,
        }),
      );

      return status(200, {
        success: true,
        message: 'File uploaded successfully',
        data: {
          name: file.name,
          url: `/storage/${key}`,
        },
      });
    },
    {
      detail: {
        summary: 'Upload File',
        description: 'Upload a file and store it in the S3 bucket (MinIO).',
        security: [{ 'Bearer Auth': [] }],
      },
      body: t.Object({
        file: t.File({
          description: 'The file to upload (multipart/form-data).',
        }),
      }),
      response: {
        200: r.Success(
          t.Object(
            {
              name: t.String(),
              url: t.String(),
            },
            { title: 'UploadedFile' },
          ),
          'File uploaded successfully',
        ),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )
  // GET /upload/storage/:key - Proxy a file out of MinIO.
  .get(
    '/storage/:key',
    async ({ params, set }) => {
      const { Body, ContentType } = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: params.key }),
      );

      set.headers['content-type'] = ContentType ?? 'application/octet-stream';
      return Body as Readable;
    },
    {
      detail: {
        summary: 'Get Stored File',
        description: 'Fetch a stored file by its key (proxied from MinIO).',
      },
      params: t.Object({
        key: t.String({ description: 'The file key as returned by upload.' }),
      }),
      response: {
        200: t.Any(),
        401: r.Failed('Unauthorized'),
        404: r.Failed('Not found'),
        500: r.Failed('Internal server error'),
      },
    },
  );
