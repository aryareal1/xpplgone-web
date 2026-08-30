import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

const S3_TIMEOUT_MS = 15_000;
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;

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
      await s3.send(new HeadBucketCommand({ Bucket: bucket }), {
        abortSignal: AbortSignal.timeout(S3_TIMEOUT_MS),
      });
    } catch (error) {
      const status = (error as { $metadata?: { httpStatusCode?: number } })
        .$metadata?.httpStatusCode;
      // Some Silo/MinIO setups return 403 for a valid bucket HEAD request.
      if (status !== 403 && status !== 404) throw error;
      await s3.send(new CreateBucketCommand({ Bucket: bucket }), {
        abortSignal: AbortSignal.timeout(S3_TIMEOUT_MS),
      });
    }
  })().catch((error) => {
    bucketReady = null;
    throw error;
  });

  return bucketReady;
}

/** S3 missing-key 404: `Head*` throws `NotFound`, `Get*` throws `NoSuchKey`. */
export const isNotFound = (error: unknown) => {
  const name = (error as { name?: string }).name;
  return name === 'NotFound' || name === 'NoSuchKey';
};

// Image re-encode settings (format kept, so the stored extension stays valid).
const IMAGE_QUALITY = 80;
const IMAGE_MAX_WIDTH = 1920;
const RE_ENCODABLE = new Set(['jpeg', 'png', 'webp', 'gif']);

/**
 * Compress an image: auto-orient (EXIF), cap width, re-encode with quality 80
 * in its original format. Non-re-encodable images pass through untouched.
 */
export async function compress(file: File): Promise<{
  buffer: Uint8Array;
  mime: string;
}> {
  const input = new Uint8Array(await file.arrayBuffer());
  const image = sharp(input, {
    animated: true,
    limitInputPixels: MAX_IMAGE_PIXELS,
  })
    .rotate()
    .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true });

  const { format } = await image.metadata();
  if (!format || !RE_ENCODABLE.has(format))
    return { buffer: input, mime: file.type };

  const encode = {
    jpeg: () =>
      image.jpeg({ quality: IMAGE_QUALITY, mozjpeg: true }).toBuffer(),
    png: () =>
      image.png({ quality: IMAGE_QUALITY, compressionLevel: 9 }).toBuffer(),
    webp: () => image.webp({ quality: IMAGE_QUALITY }).toBuffer(),
    gif: () => image.gif().toBuffer(), // GIF has no quality knob
  } as Record<string, () => Promise<Uint8Array>>;

  return { buffer: await encode[format]!(), mime: `image/${format}` };
}

export const Storage = {
  /** Upload a file to bucket; returns the generated filename. */
  async upload(file: File): Promise<string> {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('Upload too large');
    await ensureBucket();

    let buffer: Uint8Array;
    let contentType = file.type || undefined;
    if (file.type.startsWith('image/')) {
      const compressed = await compress(file);
      buffer = compressed.buffer;
      contentType = compressed.mime;
    } else {
      buffer = new Uint8Array(await file.arrayBuffer());
    }

    const filename = `${randomUUID()}${extname(file.name)}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ContentLength: buffer.byteLength,
        ContentType: contentType,
      }),
      { abortSignal: AbortSignal.timeout(S3_TIMEOUT_MS) },
    );
    return filename;
  },

  /** Stream a file out of the bucket. Returns null if the key does not exist. */
  async get(filename: string) {
    await ensureBucket();
    try {
      const { Body, ContentType } = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: filename }),
        { abortSignal: AbortSignal.timeout(S3_TIMEOUT_MS) },
      );
      return {
        body: Body,
        contentType: ContentType ?? 'application/octet-stream',
      };
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  },

  // ponytail: distinguish missing-vs-deleted via HEAD probe once a VPS
  // MinIO config without the 403-on-HEAD quirk exists.
  /** Delete a file. `DeleteObject` is idempotent: no error whether or not the key exists. */
  async remove(filename: string): Promise<boolean> {
    await ensureBucket();
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: filename }), {
      abortSignal: AbortSignal.timeout(S3_TIMEOUT_MS),
    });
    return true;
  },
};
