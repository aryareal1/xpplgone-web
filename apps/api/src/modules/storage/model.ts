import { t, type UnwrapSchema } from 'elysia';
import { r } from '@be/lib/schema';

export const StorageModel = {
  uploadBody: t.Object({
    file: t.File({ type: ['image/*', 'video/*'] }),
  }),
  uploadResponse: r.Data(
    'Upload successful',
    t.Object({
      filename: t.String(),
    }),
  ),
  uploadFailed: r.Failed('Upload failed'),

  getFileResponse: t.File(),

  deleteFileResponse: r.Success('File delete succcessful'),

  fileParam: t.Object({
    filename: t.String(),
  }),
  fileNotFound: r.Failed('File not found'),
};

export type StorageModel = {
  [k in keyof typeof StorageModel]: UnwrapSchema<(typeof StorageModel)[k]>;
};
