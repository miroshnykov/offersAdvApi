import { getConnection } from 'typeorm';
import { query } from './pgClient';

export default async () => {
  await getConnection().close();
  await query(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.TEST_DB_NAME}'`);
  await query(`drop database "${process.env.TEST_DB_NAME}"`);
};
