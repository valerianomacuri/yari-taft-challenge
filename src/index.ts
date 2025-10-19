import express, { type Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRouter from './user/user.routes';
import { registerRoutes } from './core/helpers';

const app: Application = express();
const port = 3000;
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API con Swagger',
      version: '1.0.0',
      description: 'Una simple API de Express documentada con Swagger',
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
      },
    ],
  },
  apis: ['./src/**/*.routes.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  '/api/v1',
  registerRoutes({
    path: '/users',
    router: userRouter,
  }),
);

app.listen(port, () => {
  console.log(`Server started successfully at http://localhost:${port}`);
});
