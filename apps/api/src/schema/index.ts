import Elysia, { type Static, t } from 'elysia';
import e from './enums';
import m from './models';
import r from './responses';

export { e, m, r };

export const models = new Elysia().model({
  Success: r.Success(t.Any(), 'Indicates a successfully response.'),
  Failed: r.Failed('Indicates a failed response because an error accured.'),
  ...m,
  ...e,
});

export type User = Static<typeof m.User>;
export type Student = Static<typeof m.Student>;
