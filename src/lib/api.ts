import { treaty } from '@elysiajs/eden';
import type { App } from '@/api';

const { api } = treaty<App>(
  process.env.NODE_ENV === 'production'
    ? 'https://xpplgone.vercel.app'
    : 'http://localhost:2587',
);

export default api;
