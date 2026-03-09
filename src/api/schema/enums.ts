import { t } from 'elysia';

const Role = t.Enum(
  {
    Owner: 'owner',
    Admin: 'admin',
    Teacher: 'teacher',
    'Homeroom Teacher': 'homeroom_teacher',
    President: 'president',
    'Vice President': 'vice_president',
    Treasurer: 'treasurer',
    Secretary: 'secretary',
    Member: 'member',
  },
  {
    title: 'Role',
    description: 'User role',
  },
);

const Gender = t.Enum(
  {
    Male: 'male',
    Female: 'female',
  },
  {
    title: 'Gender',
    description: 'User gender',
  },
);

export default { Role, Gender };
