import Elysia from 'elysia';
import logs from './logs';
import eids from './eids';

export default new Elysia({ prefix: '/ramadan', tags: ['Ramadan'] }).use([
  logs,
  eids,
]);
