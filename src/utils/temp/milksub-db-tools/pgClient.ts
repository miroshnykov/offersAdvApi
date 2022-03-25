import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const query = async (q: string, database?: string) => {
  const client = new Client({
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT as string, 10),
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASWD,
    database: database || process.env.TEST_DB_CONNECT || 'postgres',
  });

  console.log();
  await client.connect();
  console.log(`Executing: ${q}`);
  try {
    await client.query(q);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
};
