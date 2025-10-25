// src/config/env.config.ts
import 'dotenv-flow/config';
import { get } from 'env-var';

// dotenv-flow automatically loads:
// - .env (base)
// - .env.local (local overrides)
// - .env.test (when NODE_ENV=test)
// - .env.development (when NODE_ENV=development)
// - .env.production (when NODE_ENV=production)

export const envConfig = {
  NODE_ENV: get('NODE_ENV').asEnum(['development', 'production', 'test']),
  PORT: get('PORT').required().asPortNumber(),
  DB_HOST: get('DB_HOST').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  POKEMON_API_URL: get('POKEMON_API_URL').required().asString(),
};

export default envConfig;
