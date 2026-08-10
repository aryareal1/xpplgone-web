import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './.drizzle',
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${process.env.DATABASE_URL}${process.env.DATABASE_URL?.includes('sslmode') ? '&uselibpqcompat=true' : ''}`,
  },
});
