import { BaseEntity, getConnection } from 'typeorm';

export async function truncate(): Promise<any>;
export async function truncate(models: ReadonlyArray<typeof BaseEntity>): Promise<any>;
export async function truncate(force: boolean): Promise<any>;
export async function truncate(option?: any): Promise<any> {
  const connection = getConnection();

  if (!option) {
    return Promise.all(connection.entityMetadatas.map(async (m) => connection.query(`truncate "${m.tableName}" restart identity cascade`)));
  }

  if (Array.isArray(option)) {
    return Promise.all((option as ReadonlyArray<typeof BaseEntity>).map(async (m) => connection.query(`truncate "${connection.getMetadata(m).tableName}" restart identity cascade`)));
  }

  if (option === true) {
    return connection.synchronize(true);
  }

  return undefined;
}
