import { Logger } from 'typeorm';
import { dbCreate } from './dbCreate';
import { connect } from './testConnection';
import { enableDbLogging } from './enableDbLogging';

export const dbSetup = async () => {
  await dbCreate();

  const connection = await connect();

  // Disable logging while syncing database
  enableDbLogging(false, connection);
  console.log('Performing database sync...');
  await connection.synchronize(true);
  console.log('Sync completed');
  // Return logging back
  enableDbLogging(true, connection);
};
