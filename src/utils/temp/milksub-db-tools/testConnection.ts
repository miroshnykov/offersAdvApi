import {
  Connection, createConnection,
} from 'typeorm';
import pg from 'pg';

// @ts-ignore
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const parseBigIntArray = pg.types.getTypeParser(1016);
pg.types.setTypeParser(1016, (a) => parseBigIntArray(a).map(BigInt));
pg.types.setTypeParser(20, BigInt);

export const connect = async (logs: boolean = true): Promise<Connection> => createConnection({
  type: 'postgres',
  host: process.env.TEST_DB_HOST,
  port: parseInt(process.env.TEST_DB_PORT!, 10),
  database: process.env.TEST_DB_NAME,
  username: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASWD,
  entities: process.env.TEST_DB_MODELS!.split(' '),
  synchronize: false,
  logging: logs,
});
