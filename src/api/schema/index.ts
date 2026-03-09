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

export type OAuth = Static<typeof m.OAuth>;
export type AuthUser = Static<typeof m.AuthUser>;
export type AuthSession = Static<typeof m.AuthSession>;
export type Profile = Static<typeof m.Profile>;
export type StudentProfile = Static<typeof m.StudentProfile>;
export type Fund = Static<typeof m.Fund>;
export type FundDate = Static<typeof m.FundDate>;
