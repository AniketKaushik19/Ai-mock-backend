import knexLib from 'knex';
import config from '../knexfile.js';

const db = knexLib(config.development);

export default db;
