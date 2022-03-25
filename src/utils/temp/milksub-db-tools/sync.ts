import { createConnection, getConnectionOptions } from 'typeorm';

(async () => {
  let connectionName = process.argv[2];
  let opt = process.argv[3];

  if (process.argv[2] === 'force') {
    // eslint-disable-next-line no-param-reassign,prefer-destructuring
    opt = process.argv[2];
    // eslint-disable-next-line no-param-reassign,prefer-destructuring
    connectionName = process.argv[3];
  }
  connectionName = connectionName || 'default';

  const connectionOpts = await getConnectionOptions(connectionName);
  (connectionOpts as any).synchronize = false;
  const connection = await createConnection(connectionName);
  await connection.synchronize(opt === 'force');
})();
