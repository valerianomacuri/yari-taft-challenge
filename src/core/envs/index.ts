// src/config/env.config.ts
import 'dotenv/config';
import { get } from 'env-var';

export const envConfig = {
  NODE_ENV: get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'production', 'test']),
  PORT: get('PORT').default('3000').asPortNumber(),
  DB_HOST: get('DB_HOST').default('localhost').asString(),
  DB_PORT: get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
};

export default envConfig;
