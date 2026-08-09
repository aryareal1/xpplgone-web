import Elysia from 'elysia';
import { requireAuth } from '../auth/middleware';
import { StorageModel } from './model';
import { Storage } from './service';

export const storage = new Elysia({ prefix: '/s3', tags: ['Storage'] })
  // GET /s3/:filename
  .get(
    '/:filename',
    async ({ params }) => {
      const file = await Storage.get(params.filename);
      if (!file)
        return new Response(`File not found: ${params.filename}`, {
          status: 404,
        });
      return new Response(
        file.body!.transformToWebStream(),
        { headers: { 'content-type': file.contentType } },
      );
    },
    {
      detail: {
        summary: 'Get File',
        description: 'Fetch a stored file by its filename, proxied from MinIO.',
      },
      params: StorageModel.fileParam,
      response: {
        200: StorageModel.getFileResponse,
        404: StorageModel.fileNotFound,
      },
    },
  )

  .use(requireAuth)
  // POST /s3/upload
  .post(
    '/upload',
    async ({ body, status }) => {
      try {
        const filename = await Storage.upload(body.file);
        return status(201, {
          success: true,
          message: 'Upload successful' as const,
          data: { filename },
        });
      } catch {
        return status(400, {
          success: false,
          message: 'Upload failed',
        });
      }
    },
    {
      detail: {
        summary: 'Upload File',
        description:
          'Upload a file to the S3 bucket (MinIO). Images are compressed before being stored.',
      },
      body: StorageModel.uploadBody,
      response: {
        201: StorageModel.uploadResponse,
        400: StorageModel.uploadFailed,
      },
    },
  )

  // DELETE /s3/:filename
  .delete(
    '/:filename',
    async ({ params, status }) => {
      try {
        await Storage.remove(params.filename);
        return status(200, {
          success: true,
          message: 'File delete succcessful',
        });
      } catch {
        return status(404, {
          success: false,
          message: 'File not found',
        });
      }
    },
    {
      detail: {
        summary: 'Delete File',
        description: 'Delete a stored file by its filename.',
      },
      params: StorageModel.fileParam,
      response: {
        200: StorageModel.deleteFileResponse,
        404: StorageModel.fileNotFound,
      },
    },
  );
