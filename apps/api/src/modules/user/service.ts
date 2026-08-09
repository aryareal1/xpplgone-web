import { db, usersTable } from '@xirpl/db';
import { sql } from 'drizzle-orm';
import { ADMIN_ROLES } from '@be/lib/constants';
import { isUUID } from '@be/lib/utils';
import type { UserModel } from './model';

export const User = {
  async getAll(query?: string) {
    return await db.query.usersTable.findMany({
      columns: {
        id: true,
        email: true,
        username: true,
        display_name: true,
        avatar_url: true,
        nis: true,
        bio: true,
        gender: true,
        role: true,
        islamic_org: true,
        created_at: true,
      },
      ...(query && {
        where: {
          OR: [
            {
              username: {
                like: `%${query}%`,
              },
            },
            {
              display_name: {
                like: `%${query}%`,
              },
            },
          ],
        },
      }),
    });
  },
  async getByIdentifier(identifier: string) {
    return await db.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        username: true,
        display_name: true,
        avatar_url: true,
        nis: true,
        bio: true,
        gender: true,
        role: true,
        islamic_org: true,
        created_at: true,
      },
      where: {
        OR: [
          ...(isUUID(identifier) ? [{ id: identifier }] : [{}]),
          { RAW: (table) => sql`${table.id}::TEXT ILIKE ${`${identifier}%`}` },
          { username: identifier },
        ],
      },
    });
  },
  async getStudents() {
    const data = await db.query.usersTable.findMany({
      columns: {
        id: true,
        nis: true,
        display_name: true,
        username: true,
        gender: true,
        role: true,
        islamic_org: true,
      },
      where: {
        role: {
          notIn: ADMIN_ROLES,
        },
      },
    });
    return data.map((v) => ({
      id: v.id,
      nis: v.nis!,
      name: v.display_name || v.username,
      gender: v.gender,
      role: v.role,
      islamic_org: v.islamic_org,
    }));
  },
  async addUser(data: UserModel['addUserBody']) {
    return (await db.insert(usersTable).values(data).returning())[0]!;
  },
};
