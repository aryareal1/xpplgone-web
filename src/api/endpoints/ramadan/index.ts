import Elysia from 'elysia';
import logs from './logs';
import eids from './eids';
import ormas from './ormas';

export default new Elysia({ prefix: '/ramadan', tags: ['Ramadan'] }).use([
  logs,
  eids,
  ormas,
]);
