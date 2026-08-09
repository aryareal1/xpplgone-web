import Elysia from 'elysia';
import { UserModel } from './model';
import { User } from './service';
import { requireDev } from '../auth/middleware';

export const user = new Elysia({ prefix: '/users', tags: ['Users'] })
  // GET /users
  .get(
    '/',
    async ({ query, status }) => {
      const data = await User.getAll(query.q);
      return status(200, {
        success: true,
        message: 'Get all users successful',
        data,
      });
    },
    {
      query: UserModel.getAllQuery,
      detail: {
        summary: 'Get All Users',
        description: 'Get a list of all users, optionally filtered by a search query.',
      },
      response: {
        200: UserModel.getAllResponse,
      },
    },
  )

  // GET /users/:id
  .get(
    '/:id',
    async ({ params, status }) => {
      const data = await User.getByIdentifier(params.id);
      if (!data)
        return status(404, {
          success: false,
          message: 'User not found',
        });

      return status(200, {
        success: true,
        message: 'Get user successful',
        data,
      });
    },
    {
      params: UserModel.getIdParam,
      detail: {
        summary: 'Get User by ID',
        description: 'Get a single user by their id or username.',
      },
      response: {
        200: UserModel.getIdResponse,
        404: UserModel.getIdNotFound,
      },
    },
  )

  // GET /users/students
  .get(
    '/students',
    async ({ status }) => {
      const data = await User.getStudents();
      return status(200, {
        success: true,
        message: 'Get all students successful',
        data,
      });
    },
    {
      detail: {
        summary: 'Get All Students',
        description: 'Get a list of all users with the student role.',
      },
      response: {
        200: UserModel.getStudentsResponse,
      },
    },
  )

  .use(requireDev)
  // POST /users
  .post(
    '/',
    async ({ body, status }) => {
      const data = await User.addUser(body);
      return status(201, {
        success: true,
        message: 'Add user successful',
        data,
      });
    },
    {
      body: UserModel.addUserBody,
      detail: {
        summary: 'Add User',
        description: 'Create a new user with the provided data. Requires a developer role.',
      },
      response: {
        201: UserModel.addUserResponse,
      },
    },
  );
