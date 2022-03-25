import 'dotenv/config';
import { createConnection, ConnectionOptions } from 'typeorm';

export const testConn = (drop = false) => createConnection({
  name: 'default',
  type: 'mysql',
  host: process.env.TEST_DB_HOST,
  port: process.env.TEST_DB_PORT,
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  synchronize: drop,
  dropSchema: drop,
  entities: [
    `${__dirname}/../entity/*.ts`,
  ],
} as ConnectionOptions);
