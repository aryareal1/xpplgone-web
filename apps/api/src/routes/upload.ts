import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import Elysia, { t } from 'elysia';
import auth from '../middleware/auth';
import { r } from '../schema';

const storageDir = `${process.cwd()}/storage`;

export default new Elysia({
  prefix: '/upload',
  detail: { tags: ['Upload'] },
})
  .use(auth)
  .post(
    '/',
    async ({ body, status }) => {
      const { file } = body;

      mkdirSync(storageDir, { recursive: true });

      const filename = `${randomUUID()}${extname(file.name)}`;
      const path = `${storageDir}/${filename}`;

      // Bun's formData stores uploads on disk, so Bun.write copies file-to-file
      // without buffering in memory.
      await Bun.write(path, file);

      return status(200, {
        success: true,
        message: 'File uploaded successfully',
        data: {
          name: filename,
          url: `/storage/${filename}`,
        },
      });
    },
    {
      detail: {
        summary: 'Upload File',
        description: 'Upload a file and stream it into the storage directory.',
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
  );
