import { type TSchema, t } from 'elysia';

const Success = <T extends TSchema>(
  schema: T,
  message: string,
  description?: string,
) =>
  t.Object(
    {
      success: t.Optional(t.Boolean({ readOnly: true, default: true })),
      message: t.Optional(t.String({ readOnly: true, default: message })),
      data: schema,
    },
    {
      title: 'Success',
      description: description ?? message,
    },
  );

const Failed = (message: string) =>
  t.Object(
    {
      success: t.Optional(t.Boolean({ readOnly: true, default: false })),
      code: t.Optional(t.String({ readOnly: true })),
      message: t.Optional(t.String({ readOnly: true, default: message })),
    },
    {
      title: 'Failed',
      description: message,
    },
  );

export default { Success, Failed };
