import { DataSource } from 'typeorm';

export async function setupTestDatabase(dataSource: DataSource): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  // Drop all tables
  await dataSource.dropDatabase();

  // Recreate database structure
  await dataSource.synchronize();

  // Or run migrations
  // await dataSource.runMigrations();
}

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
}

export async function teardownTestDatabase(
  dataSource: DataSource,
): Promise<void> {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
}
