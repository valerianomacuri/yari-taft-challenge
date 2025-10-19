import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../user/user.entity';
import envVars from '../envs';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envVars.DB_HOST || 'localhost',
  port: envVars.DB_PORT || 5432,
  username: envVars.DB_USER || 'postgres',
  password: envVars.DB_PASSWORD || 'postgres',
  database: envVars.DB_NAME || 'myapp_db',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: envVars.NODE_ENV === 'development',
  logging: envVars.NODE_ENV === 'development',
};

export const PostgresDataSource = new DataSource(dataSourceOptions);
