import bearer from '@elysia/bearer';
import jwt from '@elysia/jwt';
import {
  db,
  googleIdentitiesTable,
  sessionsTable,
  usersTable,
} from '@xirpl/db';
import oauth2 from 'better-elysia-oauth2';
import { eq } from 'drizzle-orm';
import Elysia from 'elysia';
import { apiUrl } from '@/lib/constants';
import { Token } from '@/lib/utils';

export const Auth = new Elysia({ name: 'Auth.Service' })
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

          const refreshToken = Token.generate();

          const session = (
            await db
              .insert(sessionsTable)
              .values({
                user_id: user.id,
                user_agent: headers['user-agent'],
                ip: server?.requestIP(request)?.address,
                refresh_token_hash: Token.hash(refreshToken),
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

          const identityData = {
            user_id: user.id,
            sub: openId?.sub as string,
            name: (openId?.name as string) ?? '',
            given_name: openId?.given_name as string,
            family_name: openId?.family_name as string,
            picture: openId?.picture as string,
            access_token_hash: Token.hash(tokens.accessToken()),
            access_token_expired_at: tokens.accessTokenExpiresAt(),
            refresh_token_hash: Token.hash(tokens.refreshToken()),
          };
          await db
            .insert(googleIdentitiesTable)
            .values(identityData)
            .onConflictDoUpdate({
              target: googleIdentitiesTable.sub,
              set: identityData,
            });

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
            refresh_token_hash: Token.hash(refreshToken),
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

        await db
          .delete(sessionsTable)
          .where(eq(sessionsTable.id, token.sid as string));
        return true;
      },
    },
  }))
  .as('scoped');
