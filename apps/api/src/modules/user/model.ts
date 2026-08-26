import { r } from '@be/lib/schema';
import type { DeepUnwrap } from '@be/lib/utils';
import { t } from 'elysia';

const enums = {
  gender: t.Enum({
    male: 'male',
    female: 'female',
  }),
  role: t.Enum({
    developer: 'developer',
    teacher: 'teacher',
    homeroomTeacher: 'homeroom_teacher',
    leader: 'leader',
    viceLeader: 'vice_leader',
    treasurer: 'treasurer',
    secretary: 'secretary',
    member: 'member',
  }),
  islamicOrg: t.Enum({
    nu: 'nu',
    mu: 'mu',
  }),
};

const User = t.Object({
  id: t.String(),
  email: t.String(),
  username: t.String(),
  display_name: t.Optional(t.Nullable(t.String())),
  avatar_url: t.Optional(t.Nullable(t.String())),
  nis: t.Optional(t.Nullable(t.Number())),
  bio: t.Optional(t.Nullable(t.String())),
  gender: t.Optional(t.Nullable(enums.gender)),
  role: enums.role,
  islamic_org: t.Optional(t.Nullable(enums.islamicOrg)),
  created_at: t.Date(),
});

const Student = t.Object({
  id: t.String(),
  nis: t.Number(),
  name: t.String(),
  avatar_url: t.Optional(t.Nullable(t.String())),
  gender: t.Optional(t.Nullable(enums.gender)),
  role: enums.role,
  islamic_org: t.Optional(t.Nullable(enums.islamicOrg)),
});

export const UserModel = {
  User,
  Student,
  enums,

  getAllQuery: t.Partial(
    t.Object({
      q: t.String(),
    }),
  ),
  getAllResponse: r.Data('Get all users successful', t.Array(User)),

  getIdParam: t.Object({
    id: t.String(),
  }),
  getIdResponse: r.Data('Get user successful', User),
  getIdNotFound: r.Failed('User not found'),

  getStudentsResponse: r.Data('Get all students successful', t.Array(Student)),

  addUserBody: t.Omit(User, ['id', 'created_at']),
  addUserResponse: r.Data('Add user successful', User),
};

export type UserModel = {
  [k in keyof typeof UserModel]: DeepUnwrap<(typeof UserModel)[k]>;
};
