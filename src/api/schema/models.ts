import { t } from 'elysia';
import { e } from '.';

const OAuth = t.Object(
  {
    provider: t.String({ default: 'google' }),
    url: t.String({
      example:
        'https://vyxbdrgitotylxiwvwyt.supabase.co/auth/v1/authorize?provider=google&code_challenge=...&code_challenge_method=s256',
    }),
  },
  {
    title: 'OAuth',
  },
);

/** Auth user */
const AuthUser = t.Object(
  {
    id: t.String(),
    app_metadata: t.Any(),
    user_metadata: t.Any(),
    aud: t.String(),
    confirmation_sent_at: t.Optional(t.String()),
    recovery_sent_at: t.Optional(t.String()),
    email_change_sent_at: t.Optional(t.String()),
    new_email: t.Optional(t.String()),
    new_phone: t.Optional(t.String()),
    invited_at: t.Optional(t.String()),
    action_link: t.Optional(t.String()),
    email: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    created_at: t.String(),
    confirmed_at: t.Optional(t.String()),
    email_confirmed_at: t.Optional(t.String()),
    phone_confirmed_at: t.Optional(t.String()),
    last_sign_in_at: t.Optional(t.String()),
    role: t.Optional(t.String()),
    updated_at: t.Optional(t.String()),
    identities: t.Optional(t.Array(t.Any())),
    is_anonymous: t.Optional(t.Boolean()),
    is_sso_user: t.Optional(t.Boolean()),
    factors: t.Optional(t.Array(t.Any())),
    deleted_at: t.Optional(t.String()),
    banned_until: t.Optional(t.String()),
  },
  {
    title: 'AuthUser',
  },
);

/** Auth session */
const AuthSession = t.Object(
  {
    provider_token: t.Optional(t.Nullable(t.String())),
    provider_refresh_token: t.Optional(t.Nullable(t.String())),
    access_token: t.String(),
    refresh_token: t.String(),
    token_type: t.String(),
    expires_in: t.Number(),
    expires_at: t.Optional(t.Number()),
    user: t.Optional(AuthUser),
  },
  {
    title: 'AuthSession',
  },
);

/** User profile */
const Profile = t.Object(
  {
    id: t.Number(),
    uid: t.String(),
    username: t.String(),
    display_name: t.Optional(t.MaybeEmpty(t.String())),
    original_name: t.Optional(t.MaybeEmpty(t.String())),
    avatar_url: t.Optional(t.MaybeEmpty(t.String())),
    bio: t.Optional(t.MaybeEmpty(t.String())),
    role: e.Role,
    gender: e.Gender,
    email: t.Optional(t.String()),
  },
  {
    title: 'Profile',
  },
);

/** Student profile */
const StudentProfile = t.Object(
  {
    id: t.Number(),
    uid: t.String(),
    name: t.String(),
    role: e.Role,
    gender: e.Gender,
  },
  {
    title: 'StudentProfile',
  },
);

/** Fund data */
const Fund = t.Object(
  {
    id: t.Number(),
    user: t.String(),
    date: t.String(),
    amount: t.Number(),
    created_at: t.String(),
    updated_at: t.String(),
    updated_by: t.String(),
  },
  {
    title: 'FundData',
  },
);

/** Fund date */
const FundDate = t.Object(
  {
    date: t.String(),
    created_at: t.String(),
    created_by: t.String(),
  },
  {
    title: 'FundDate',
  },
);

export default {
  OAuth,
  AuthUser,
  AuthSession,
  Profile,
  StudentProfile,
  Fund,
  FundDate,
};
