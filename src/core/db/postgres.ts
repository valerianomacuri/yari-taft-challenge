import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../user/user.entity';
import envVars from '../envs';

const isCompiled = __filename.endsWith('.js');
const isTest = envVars.NODE_ENV === 'test';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envVars.DB_HOST,
  port: envVars.DB_PORT,
  username: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  database: envVars.DB_NAME,
  entities: [User],
  migrations: isCompiled ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
  synchronize: isTest,
  logging: envVars.NODE_ENV === 'development',
};

export const PostgresDataSource = new DataSource(dataSourceOptions);
