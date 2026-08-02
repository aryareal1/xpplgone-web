import { t } from 'elysia';
import { e } from '.';

const User = t.Object(
  {
    id: t.String(),
    email: t.String(),
    username: t.String(),
    display_name: t.Optional(t.MaybeEmpty(t.String())),
    avatar_url: t.Optional(t.MaybeEmpty(t.String())),
    bio: t.Optional(t.MaybeEmpty(t.String())),
    gender: t.Nullable(e.Gender),
    role: e.Role,
    nis: t.Nullable(t.Number()),
    islamic_org: t.Nullable(e.IslamicOrg),
    created_at: t.Date(),
  },
  {
    title: 'User',
  },
);

const Student = t.Object(
  {
    id: t.String(),
    nis: t.Number(),
    name: t.String(),
    role: e.Role,
    gender: t.Nullable(e.Gender),
    islamic_org: t.Nullable(e.IslamicOrg),
  },
  {
    title: 'Student',
  },
);

export default {
  User,
  Student,
};
