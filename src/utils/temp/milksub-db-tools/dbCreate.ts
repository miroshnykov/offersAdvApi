import { query } from './pgClient';

export const dbCreate = async () => {
  if (!process.env.TEST_DB_NAME) {
    throw new Error('process.env.TEST_DB_NAME must be set');
  }

  // Disconnect all other users
  await query(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.TEST_DB_NAME}'`);
  await query(`drop database if exists "${process.env.TEST_DB_NAME}"`);
  await query(`create database "${process.env.TEST_DB_NAME}"`);
  if (process.env.TEST_DB_SCHEMA) {
    await query(`create schema "${process.env.TEST_DB_SCHEMA}"`, process.env.TEST_DB_NAME);
  }
};
