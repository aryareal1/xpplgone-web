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

const Failed = <T extends TSchema>(message: string, schema?: T) =>
  t.Object(
    {
      success: t.Optional(t.Boolean({ readOnly: true, default: false })),
      message: t.Optional(t.String({ readOnly: true, default: message })),
      error: t.Composite([
        t.Object({
          status: t.Number(),
          code: t.String(),
          reason: t.String(),
        }),
        schema ?? t.Object({}),
      ]),
    },
    {
      title: 'Failed',
      description: message,
    },
  );

export default { Success, Failed };
