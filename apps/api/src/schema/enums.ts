import { t } from 'elysia';

const Role = t.Enum(
  {
    Developer: 'developer',
    Teacher: 'teacher',
    'Homeroom Teacher': 'homeroom_teacher',
    Leader: 'leader',
    'Vice Leader': 'vice_leader',
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

const IslamicOrg = t.Enum(
  {
    NU: 'nu',
    MU: 'mu',
  },
  {
    title: 'IslamicOrg',
    description: 'Ormas Islam',
  },
);

export default { Role, Gender, IslamicOrg };
