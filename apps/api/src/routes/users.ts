import { db, users } from '@xirpl/db';
import Elysia, { t } from 'elysia';
import auth from '../middleware/auth';
import { e, m, r } from '../schema';

export default new Elysia({
  prefix: '/users',
  detail: { tags: ['Users'] },
})
  // GET /users/:q - Get user by id or username
  .get(
    '/:q',
    async ({ params, status }) => {
      const { q } = params;

      const user = await db.query.users.findFirst({
        where: {
          OR: [{ id: q }, { username: q }],
        },
        columns: {
          id: true,
          email: true,
          username: true,
          display_name: true,
          avatar_url: true,
          bio: true,
          role: true,
          gender: true,
          nis: true,
          islamic_org: true,
          created_at: true,
        },
      });

      if (!user)
        return status(404, {
          success: false,
          message: 'User not found',
        });

      return status(200, {
        success: true,
        message: 'User profile get successful',
        data: user,
      });
    },
    {
      detail: {
        summary: 'Get User by ID',
        description: 'Get the user by id or uid.',
      },
      params: t.Object({
        q: t.String({
          description: 'The user id or username to get',
        }),
      }),
      response: {
        200: r.Success(m.User, 'User profile get successful', 'User profile'),
        404: r.Failed('User not found'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // GET /users/students - Get students
  .get(
    '/students',
    async ({ query, status }) => {
      let { include_roles, exclude_roles, sort } = query;
      sort = sort ?? 'display_name';

      const include = include_roles?.split(',') || ([] as any);
      const exclude = exclude_roles?.split(',') || ([] as any);

      const users = await db.query.users.findMany({
        where: {
          role: {
            in: include,
            notIn: ['developer', 'teacher', 'homeroom_teacher', ...exclude],
          },
        },
        columns: {
          id: true,
          username: true,
          display_name: true,
          gender: true,
          role: true,
          nis: true,
          islamic_org: true,
        },
      });

      return status(200, {
        success: true,
        message: 'Success get all students',
        data: users.map((u) => ({
          id: u.id,
          name: u.display_name || u.username,
          nis: u.nis || 0,
          gender: u.gender,
          role: u.role,
          islamic_org: u.islamic_org,
        })),
      });
    },
    {
      detail: {
        summary: 'Get Students',
        description: 'Get all students.',
      },
      query: t.Object({
        include_roles: t.Optional(
          t.String({ description: 'Roles to include, comma separated' }),
        ),
        exclude_roles: t.Optional(
          t.String({ description: 'Roles to exclude, comma separated' }),
        ),
        sort: t.Optional(
          t.Enum(
            {
              ID: 'id',
              Username: 'username',
              'Display Name': 'display_name',
              Bio: 'bio',
              Gender: 'gender',
              Role: 'role',
              'Updated At': 'updated_at',
            },
            {
              description: 'Sort by',
              example: 'full_name',
            },
          ),
        ),
      }),
      response: {
        200: r.Success(
          t.Array(m.Student),
          'Success get all students',
          'Students list',
        ),
        500: r.Failed('Internal server error'),
      },
    },
  )

  .use(auth)
  // POST /users - Create User
  .post(
    '/',
    async ({ body, auth, status }) => {
      if (auth.user.role !== 'developer')
        return status(403, {
          success: false,
          message: 'Forbidden',
        });

      const newUser = (
        await db.insert(users).values(body).returning({
          id: users.id,
          email: users.email,
          username: users.username,
          display_name: users.display_name,
          avatar_url: users.avatar_url,
          bio: users.bio,
          role: users.role,
          gender: users.gender,
          nis: users.nis,
          islamic_org: users.islamic_org,
          created_at: users.created_at,
        })
      )[0];

      if (!newUser)
        return status(500, {
          success: false,
          message: 'Internal server error',
        });

      return status(201, {
        success: true,
        message: 'User created successfully',
        data: newUser,
      });
    },
    {
      detail: {
        summary: 'Create User',
        description: 'Create a new user.',
        security: [{ 'Bearer Auth': [] }],
      },
      body: t.Object({
        email: t.String({
          description: 'The email of the user',
          minLength: 1,
        }),
        username: t.String({
          description: 'The name of the user',
          minLength: 1,
        }),
        bio: t.Optional(t.String({ description: 'The bio of the user' })),
        display_name: t.Optional(
          t.String({
            description: 'The display name of the user',
          }),
        ),
        gender: t.Union([e.Gender], { description: 'The gender of the user' }),
        role: t.Union([e.Role], { description: 'The role of the user' }),
        nis: t.Optional(t.Number({ description: 'The nis of the user' })),
      }),
      response: {
        201: r.Success(m.User, 'User created successfully', 'User profile'),
        401: r.Failed('Unauthorized'),
        403: r.Failed('Forbidden'),
        500: r.Failed('Internal server error'),
      },
    },
  );
