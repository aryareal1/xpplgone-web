import { t } from 'elysia';
import { e } from '.';

const User = t.Object(
  {
    id: t.String(),
    email: t.String(),
    username: t.String(),
    display_name: t.Optional(t.MaybeEmpty(t.String())),
    avatar_url: t.Optional(t.MaybeEmpty(t.String())),
    bio: t.Optional(t.MaybeEmpty(t.String())),
    gender: t.Nullable(e.Gender),
    role: e.Role,
    nis: t.Nullable(t.Number()),
    islamic_org: t.Nullable(e.IslamicOrg),
    created_at: t.Date(),
  },
  {
    title: 'User',
  },
);

const Student = t.Object(
  {
    id: t.String(),
    nis: t.Number(),
    name: t.String(),
    role: e.Role,
    gender: t.Nullable(e.Gender),
    islamic_org: t.Nullable(e.IslamicOrg),
  },
  {
    title: 'Student',
  },
);

const Photo = t.Object(
  {
    data: t.String({
      description: 'Downscaled JPEG data URL of the proof photo.',
    }),
    at: t.String({
      description: 'ISO timestamp when the photo was taken.',
    }),
  },
  {
    title: 'Photo',
  },
);

const HabitDay = t.Object(
  {
    date: t.String({
      description: 'Journal date in YYYY-MM-DD format.',
    }),
    ibadah: t.Array(t.Nullable(t.Boolean()), {
      description: '4 ibadah answers: Duha, Tahajud, Qabliyah Subuh, Ba\'diah Isya.',
    }),
    hadir: t.Nullable(
      t.Object(
        {
          at: t.String({ description: 'ISO timestamp of check-in.' }),
          late: t.Boolean(),
        },
        { title: 'Attendance' },
      ),
    ),
    olahraga: t.Object(
      {
        done: t.Nullable(t.Boolean()),
        sport: t.String(),
        minutes: t.Nullable(t.Number()),
        photo: t.Nullable(Photo),
        alt: t.String(),
      },
      { title: 'Sport' },
    ),
    belajar: t.Object(
      {
        done: t.Nullable(t.Boolean()),
        start: t.Nullable(Photo),
        end: t.Nullable(Photo),
        alt: t.String(),
        topic: t.String(),
        media: t.String(),
      },
      { title: 'Study' },
    ),
  },
  {
    title: 'HabitDay',
  },
);

export default {
  User,
  Student,
  Photo,
  HabitDay,
};
