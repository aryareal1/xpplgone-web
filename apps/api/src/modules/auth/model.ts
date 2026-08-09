import { t, type UnwrapSchema } from 'elysia';
import { r } from '@/lib/schema';
import { UserModel } from '../user/model';

export const AuthModel = {
  oauthQuery: t.Object({
    redirect_to: t.Optional(t.String()),
  }),
  refreshResponse: r.Data(
    'Refresh successful',
    t.Object({
      access_token: t.String(),
    }),
  ),
  logoutResponse: r.Success('Logout successful'),
  meResponse: r.Data(
    'Me successful',
    t.Intersect([
      UserModel.User,
      t.Object({
        last_sign_in_at: t.Optional(t.Nullable(t.Date())),
        updated_at: t.Optional(t.Nullable(t.Date())),
      }),
    ]),
  ),

  unauthorized: r.Failed('Unauthorized'),
  forbidden: r.Failed('Forbidden'),
};
export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
