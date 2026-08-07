import crypto from 'node:crypto';
import bearer from '@elysia/bearer';
import jwt from '@elysia/jwt';
import { db, googleIdentitiesTable, sessionsTable, usersTable } from '@xirpl/db';
import oauth2 from 'better-elysia-oauth2';
import { eq } from 'drizzle-orm';
import Elysia from 'elysia';
import { apiUrl } from '../utils';

export default new Elysia({ name: 'auth' })
  .use(
    oauth2({
      Google: [
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
        `${apiUrl}/auth/callback`,
      ],
    }),
  )
  .use(jwt({ secret: process.env.JWT_SECRET! }))
  .use(bearer())
  .derive(({ oauth2, jwt, server, headers, request }) => ({
    auth: {
      generateUrl(redirectUrl = '/') {
        const url = oauth2.createURL('Google', ['openid email profile'], {
          redirectUrl,
        });
        url.searchParams.set('access_type', 'offline');
        url.searchParams.set('prompt', 'consent');

        return url.href;
      },
      async exchangeCode(code?: string, codeVerifier?: string) {
        if (code && codeVerifier) {
          // TODO: implement for mobile exchange.
          return null;
        } else {
          const { tokens, payload, openId } = await oauth2.authorize<{
            redirectUrl: string;
          }>('Google');

          const user = await db.query.usersTable.findFirst({
            where: {
              email: openId?.email as string,
            },
            columns: {
              id: true,
              avatar_url: true,
            },
          });
          if (!user) return null;

          const refreshToken = generateToken();

          const session = (
            await db
              .insert(sessionsTable)
              .values({
                user_id: user.id,
                user_agent: headers['user-agent'],
                ip: server?.requestIP(request)?.address,
                refresh_token_hash: hashToken(refreshToken),
              })
              .returning({ id: sessionsTable.id })
          )[0];

          const accessToken = await jwt.sign({
            sub: user.id,
            sid: session?.id,
            iat: true,
            exp: Math.floor(Date.now() / 1000 + 60 * 60),
          });

          await db
            .update(usersTable)
            .set({
              avatar_url: !user.avatar_url
                ? (openId?.picture as string)
                : undefined,
              last_sign_in_at: new Date(),
            })
            .where(eq(usersTable.id, user.id));

          // Upsert google identity for the user.
          const existingIdentity = await db.query.googleIdentitiesTable.findFirst({
            where: { user_id: user.id },
            columns: { id: true },
          });

          const identityData = {
            user_id: user.id,
            sub: openId?.sub as string,
            name: (openId?.name as string) ?? '',
            given_name: openId?.given_name as string,
            family_name: openId?.family_name as string,
            picture: openId?.picture as string,
            access_token_hash: hashToken(tokens.accessToken()),
            access_token_expired_at: tokens.accessTokenExpiresAt(),
            refresh_token_hash: hashToken(tokens.refreshToken()),
          };

          if (existingIdentity) {
            await db
              .update(googleIdentitiesTable)
              .set(identityData)
              .where(eq(googleIdentitiesTable.id, existingIdentity.id));
          } else {
            await db.insert(googleIdentitiesTable).values(identityData);
          }

          return {
            refreshToken,
            accessToken,
            redirectUrl: payload.redirectUrl,
          };
        }
      },
      async resolveToken(accessToken: string) {
        const token = await jwt.verify(accessToken);
        if (!token) return null;

        const session = await db.query.sessionsTable.findFirst({
          where: {
            id: token.sid as string,
            user_id: token.sub,
          },
          with: {
            user: true,
          },
        });
        if (!session) return null;

        return { session, user: session.user };
      },
      async refresh(refreshToken: string) {
        const session = await db.query.sessionsTable.findFirst({
          where: {
            refresh_token_hash: hashToken(refreshToken),
          },
          columns: {
            id: true,
            user_id: true,
          },
        });
        if (!session) return null;

        const accessToken = await jwt.sign({
          sub: session.user_id,
          sid: session.id,
          iat: true,
          exp: Math.floor(Date.now() / 1000 + 60 * 60),
        });

        await db
          .update(sessionsTable)
          .set({
            refreshed_at: new Date(),
            expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          })
          .where(eq(sessionsTable.id, session.id));

        return accessToken;
      },
      async revoke(accessToken: string) {
        const token = await jwt.verify(accessToken);
        if (!token) return null;

        await db.delete(sessionsTable).where(eq(sessionsTable.id, token.sid as string));
        return true;
      },
    },
  }))
  .resolve(async ({ auth, bearer, cookie }) => {
    const accessToken = (bearer || cookie.access_token?.value) as
      | string
      | undefined;
    if (!accessToken) return { auth: { ...auth, session: null, user: null } };

    const data = await auth.resolveToken(accessToken);
    if (!data) return { auth: { ...auth, session: null, user: null } };

    const refreshToken = cookie.refresh_token?.value as string | undefined;

    return {
      auth: {
        ...auth,
        user: data.user,
        session: {
          ...data.session,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    };
  })
  .as('global');

/**
 * Generate a random 64 bytes base64url token.
 * @returns
 */
export function generateToken() {
  return crypto.randomBytes(64).toString('base64url');
}

/**
 * Hash a token using HMAC SHA256.
 * @param token
 * @returns
 */
export function hashToken(token: string) {
  return crypto
    .createHmac('sha256', process.env.HASH_SECRET!)
    .update(token)
    .digest('hex');
}
