import openapi from '@elysiajs/openapi';
import { Elysia, redirect } from 'elysia';
import auth from './endpoints/auth';
import users from './endpoints/users';
import funds from './endpoints/funds';
import { models } from './schema';
import { SITE_NAME } from '@/lib/constants';

const App = new Elysia({ prefix: '/api' })
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: 'API Documentation',
          version: '1.0.0',
          description: 'RESTful API that used by X PPLG 1',
        },
        tags: [
          {
            name: 'Auth',
            description:
              'Manage the auth system using Supabase and Google OAuth provider.',
          },
          {
            name: 'Users',
            description: 'Manage the user profile and data.',
          },
          {
            name: 'Funds',
            description:
              'Manage the class funds data.\n\n_This endpoints are still work in progress and may change in the future_',
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
  .use([auth, users, funds])
  .get('/', redirect('/api/docs'), { detail: { hide: true } });

export default App;
export type App = typeof App;
