import { QueryRunner } from 'typeorm';

export const typeExists = async (runner: QueryRunner, typename: string): Promise<boolean> => {
  const types = await runner.query(`SELECT 1 FROM pg_type WHERE typname = '${typename}'`);
  return types.length > 0;
};
