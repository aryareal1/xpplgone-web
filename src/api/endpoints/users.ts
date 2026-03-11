import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import Elysia, { t } from 'elysia';
import { e, m, r } from '../schema';

export default new Elysia({
  prefix: '/users',
  detail: { tags: ['Users'] },
})
  // GET /users/me - Get current user
  .get(
    '/me',
    async ({ status }) => {
      const supabase = await createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user || error) {
        if (error?.name === 'AuthSessionMissingError')
          return status(401, {
            success: false,
            message: 'Unauthorized',
            error: {
              status: 401,
              code: 'UNAUTHORIZED',
              reason: 'User are not logged in',
            },
          });

        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: error?.status ?? 500,
            code: error?.name ?? 'INTERNAL_SERVER_ERROR',
            reason: error?.message ?? 'Internal server error',
          },
        });
      }

      const profile = (
        await supabase
          .from('user_profiles')
          .select('*')
          .eq('uid', user.id)
          .single()
      ).data;

      return status(200, {
        success: true,
        message: 'User profile get successful',
        data: {
          id: profile.id,
          uid: user.id,
          username: profile.username,
          display_name: profile.display_name,
          original_name: user.user_metadata.name,
          avatar_url: user.user_metadata.avatar_url,
          bio: profile.bio,
          role: profile.role,
          gender: profile.gender,
          email: user.user_metadata.email,
        },
      });
    },
    {
      detail: {
        summary: 'Get Current User',
        description: 'Get the current user authenticated.',
        security: [{ 'Bearer Auth': [] }],
      },
      response: {
        200: r.Success(
          m.Profile,
          'User profile get successful',
          'User profile',
        ),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // GET /users/:id - Get user by id or uid
  .get(
    '/:id',
    async ({ params, status }) => {
      const supabase = createAdminClient();
      let q = params.id;
      let response: any, profile: any;

      q = q.replace(/^@/, '');
      if (
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          q,
        )
      )
        response = await supabase.auth.admin.getUserById(q);
      else {
        profile = (
          await supabase.from('user_profiles').select('*').eq('id', q).single()
        ).data;
        if (!profile)
          return status(404, {
            success: false,
            message: 'User not found',
            error: {
              status: 404,
              code: 'USER_NOT_FOUND',
              reason: 'User not found',
            },
          });
        response = await supabase.auth.admin.getUserById(profile.uid);
      }

      const { data, error } = response;
      if (error) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: 500,
            code: error.name,
            reason: error.message,
          },
        });
      }
      if (!data.user)
        return status(404, {
          success: false,
          message: 'User not found',
          error: {
            status: 404,
            code: 'USER_NOT_FOUND',
            reason: 'User not found',
          },
        });

      const { user } = data;
      if (!profile)
        profile = (
          await supabase
            .from('user_profiles')
            .select('*')
            .eq('uid', user.id)
            .single()
        ).data;

      return status(200, {
        success: true,
        message: 'User profile get successful',
        data: {
          id: profile.id,
          uid: user.id,
          username: profile.username,
          display_name: profile.display_name,
          original_name: user.user_metadata.name,
          avatar_url: user.user_metadata.avatar_url,
          bio: profile.bio,
          role: profile.role,
          gender: profile.gender,
          email: user.user_metadata.email,
        },
      });
    },
    {
      detail: {
        summary: 'Get User by ID',
        description: 'Get the user by id or uid.',
      },
      params: t.Object({
        id: t.String({
          description: 'The user id or uid to get',
        }),
      }),
      response: {
        200: r.Success(
          m.Profile,
          'User profile get successful',
          'User profile',
        ),
        404: r.Failed('User not found'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  .post(
    '/',
    async ({ body, status }) => {
      const supabase = createAdminClient();
      const { data: auth } = await (await createClient()).auth.getUser();

      if (!auth.user)
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'Unauthorized',
          },
        });

      const { data: authProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('uid', auth.user.id)
        .single();

      if (!['owner', 'admin'].includes(authProfile?.role))
        return status(403, {
          success: false,
          message: 'Forbidden',
          error: {
            status: 403,
            code: 'FORBIDDEN',
            reason: 'Forbidden',
          },
        });

      const { data, error } = await supabase.auth.admin.createUser({
        email: body.email,
      });

      if (error)
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: 500,
            code: error.name,
            reason: error.message,
          },
        });

      const { user } = data;
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          uid: user.id,
          username: body.username,
          display_name: body.display_name,
          bio: body.bio,
          gender: body.gender,
          role: body.role,
          nis: body.nis,
        })
        .select('*')
        .single();

      if (profileError)
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...profileError,
            status: 500,
            code: profileError.name,
            reason: profileError.message,
          },
        });

      return status(200, {
        success: true,
        message: 'User created successfully',
        data: {
          id: profile.id,
          uid: user.id,
          username: profile.username,
          display_name: profile.display_name,
          original_name: user.user_metadata.name,
          avatar_url: user.user_metadata.avatar_url,
          bio: profile.bio,
          role: profile.role,
          gender: profile.gender,
          email: user.user_metadata.email,
        },
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
        200: r.Success(m.Profile, 'User created successfully', 'User profile'),
        400: r.Failed('Invalid request'),
        401: r.Failed('Unauthorized'),
        403: r.Failed('Forbidden'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // GET /users/students - Get students
  .get(
    '/students',
    async ({ query, status }) => {
      let { role, sort } = query;
      sort = sort ?? 'display_name';
      const supabase = await createClient();

      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order(sort);

      if (error)
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: 500,
            code: error.name,
            reason: error.message,
          },
        });

      if (!data)
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            status: 500,
            code: 'MISSING_DATA',
            reason: 'Missing data',
          },
        });

      data = data.map(({ id, uid, display_name: name, role, gender }) => ({
        id,
        uid,
        name,
        role,
        gender,
      }));

      role = `${role ? `${role},` : ''}!owner,!admin`;
      const isAnd = role.split(',').some((r) => !r.startsWith('!'));

      return status(200, {
        success: true,
        message: 'Success get all students',
        data: data.filter((u) =>
          isAnd
            ? role.split(',').includes(u.role) &&
              !role.split(',').includes(`!${u.role}`)
            : role.split(',').includes(u.role) ||
              !role.split(',').includes(`!${u.role}`),
        ),
      });
    },
    {
      detail: {
        summary: 'Get Students',
        description: 'Get all students.',
      },
      query: t.Object({
        role: t.Optional(t.String({ description: 'Role of the user' })),
        sort: t.Optional(
          t.Enum(
            {
              ID: 'id',
              UID: 'uid',
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
          t.Array(m.StudentProfile),
          'Success get all students',
          'Students list',
        ),
        500: r.Failed('Internal server error'),
      },
    },
  );
