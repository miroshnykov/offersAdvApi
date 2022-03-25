import { QueryRunner } from 'typeorm';

export const constraintExists = async (runner: QueryRunner, table: string, constraint: string): Promise<boolean> => {
  const constraints = await runner.query(`SELECT 1 FROM information_schema.table_constraints  WHERE table_name = '${table}' and constraint_name = '${constraint}'`);
  return constraints.length > 0;
};
