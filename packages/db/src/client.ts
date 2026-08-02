import { drizzle } from 'drizzle-orm/bun-sql';
import relations from './schema/relations';

export const db = drizzle(process.env.DATABASE_URL!, { relations });
export default db;
