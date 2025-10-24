import 'reflect-metadata';
import express, { type Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRouter from './user/user.routes';
import { registerRoutes } from './core/utils/routes';
import { PostgresDataSource } from './core/db/postgres';
import envVars from './core/envs';

const app: Application = express();
const port = envVars.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokemon Trainer API',
      version: '1.0.0',
      description: 'API REST para gestión de usuarios y sus equipos Pokemon',
      contact: {
        name: 'API Support',
        email: 'support@pokemontrainer.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'User Pokemon',
        description: 'Pokemon team management for users',
      },
    ],
  },
  apis: ['./src/**/*.routes.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', registerRoutes({ path: '/users', router: userRouter }));

PostgresDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
      console.log(`API Docs available at http://localhost:${port}/api-docs`);
    });
  })
  .catch((error: any) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });
