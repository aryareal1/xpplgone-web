import { cors } from '@elysia/cors';
import openapi from '@elysia/openapi';
import { SITE_NAME } from '@xirpl/shared';
import { Elysia, redirect } from 'elysia';
import auth from './routes/auth';
import users from './routes/users';
import { models } from './schema';
import { webUrl } from './utils';

const app = new Elysia()
  .use(cors({ origin: webUrl, credentials: true }))
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: 'API Documentation',
          version: '2.0.0',
          description: 'RESTful API that used by XI RPL',
        },
        tags: [
          {
            name: 'Auth',
            description: 'Manage the auth system using Google OAuth provider.',
          },
          {
            name: 'Users',
            description: 'Manage the user profile and data.',
          },
        ],
        components: {
          securitySchemes: {
            'Bearer Auth': {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      scalar: {
        metaData: {
          title: `API Docs | ${SITE_NAME}`,
        },
      },
    }),
  )
  .use(models)
  .use([auth, users])
  .get('/', redirect('/docs'), { detail: { hide: true } });

export default app;
export type App = typeof app;
