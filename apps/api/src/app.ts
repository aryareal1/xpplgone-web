import { cors } from '@elysia/cors';
import openapi from '@elysia/openapi';
import { SITE_NAME } from '@xirpl/shared';
import { Elysia } from 'elysia'
import { webUrl } from '@/lib/constants';
import { auth } from './modules/auth';
import { user } from './modules/user';
import { checkins } from './modules/checkins';
import { checkinsAdmin } from './modules/checkins/admin';
import { journal } from './modules/journal';
import { journalAdmin } from './modules/journal/admin';
import { storage } from './modules/storage';

const app = new Elysia()
  .use(cors({ origin: webUrl, credentials: true }))
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: 'XI RPL API Documentation',
          version: '2.0.0',
          description:
            'XI RPL API is the backend API used for managing the XI RPL system. It is mainly used for https://xirpl.tigasearah.my.id\n' +
            '\n' +
            'This API is powered by ElysiaJS.',
        },
        tags: [
          {
            name: 'Authentication',
          },
          {
            name: 'Users',
          },
          {
            name: 'Checkins'
          },
          {
            name: 'Journals'
          },
          {
            name: 'Storage'
          }
        ],
        components: {
          securitySchemes: {
            'Access Token': {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      scalar: {
        metaData: {
          title: `API Docs - ${SITE_NAME}`,
        },
        customCss: '',
        theme: 'kepler',
        hideClientButton: true,
      },
    }),
  )
  .onError(({ error, code, status }) => {
    if (code === 'UNKNOWN' || code === 'INTERNAL_SERVER_ERROR')
      return status(500, {
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : {
              error,
            }),
      });
  })

  .use([auth, user, checkins, checkinsAdmin, journal, journalAdmin, storage])
  .get('/', ({ redirect }) => redirect('/docs'), { detail: { hide: true } });

export default app;
export type App = typeof app;
