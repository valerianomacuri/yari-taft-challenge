import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../user/user.entity';
import envVars from '../envs';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envVars.DB_HOST,
  port: envVars.DB_PORT,
  username: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  database: envVars.DB_NAME,
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: envVars.NODE_ENV === 'development',
  logging: envVars.NODE_ENV === 'development',
};

export const PostgresDataSource = new DataSource(dataSourceOptions);
