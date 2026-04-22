import Elysia from 'elysia';
import eids from './eids';
import logs from './logs';
import ormas from './ormas';

export default new Elysia({ prefix: '/ramadan', tags: ['Ramadan'] }).use([
  logs,
  eids,
  ormas,
]);
