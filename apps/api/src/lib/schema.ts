import { type TSchema, t } from 'elysia';

export const r = {
  Success: <M extends string>(message: M) =>
    t.Object(
      {
        success: t.Literal(true),
        message: t.Literal(message),
      },
      {
        description: message,
      },
    ),
  Data: <M extends string, T extends TSchema>(message: M, model: T) =>
    t.Object(
      {
        success: t.Literal(true),
        message: t.Literal(message),
        data: model,
      },
      {
        description: message,
      },
    ),
  Failed: <M extends string>(message: M) =>
    t.Object(
      {
        success: t.Literal(false),
        message: t.Literal(message),
      },
      {
        description: message,
      },
    ),
  Error: <M extends string>(message: M) =>
    t.Object(
      {
        success: t.Literal(false),
        message: t.Literal(message),
        error: t.Any(),
      },
      {
        description: message,
      },
    ),
};
