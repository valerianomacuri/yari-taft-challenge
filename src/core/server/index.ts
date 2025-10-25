import 'reflect-metadata';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRouter from '../../user/user.routes';
import envVars from '../envs';
import { PostgresDataSource } from '../db';
import { registerRoutes } from '../utils/routes';

export class Server {
  private app: Express;
  private port: number;
  private isInitialized: boolean = false;

  constructor() {
    this.app = express();
    this.port = envVars.PORT || 3000;
    this.initialize(); // Inicializar automáticamente
  }

  /**
   * Inicializa middlewares, swagger y rutas (sin DB ni listen)
   */
  private initialize(): void {
    if (this.isInitialized) return;

    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();

    this.isInitialized = true;
  }

  /**
   * Inicializa middlewares globales
   */
  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Configura Swagger (documentación API)
   */
  private initializeSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Pokemon Trainer API',
          version: '1.0.0',
          description:
            'API REST para gestión de usuarios y sus equipos Pokemon',
          contact: {
            name: 'API Support',
            email: 'support@pokemontrainer.com',
          },
        },
        servers: [
          {
            url: `http://localhost:${this.port}/api/v1`,
            description: 'Development server',
          },
        ],
        tags: [
          { name: 'Users', description: 'User management operations' },
          {
            name: 'User Pokemon',
            description: 'Pokemon team management for users',
          },
        ],
      },
      apis: ['./src/**/*.routes.ts'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  /**
   * Registra las rutas principales de la aplicación
   */
  private initializeRoutes(): void {
    this.app.use(
      '/api/v1',
      registerRoutes({ path: '/users', router: userRouter }),
    );
  }

  /**
   * Conecta la base de datos
   */
  private async connectDatabase(): Promise<void> {
    try {
      if (!PostgresDataSource.isInitialized) {
        await PostgresDataSource.initialize();
        console.log('✅ Database connected successfully');
      }
    } catch (error) {
      console.error('❌ Error connecting to database:', error);
      throw error;
    }
  }

  /**
   * Inicia el servidor (para producción/desarrollo)
   */
  public async start(): Promise<void> {
    await this.connectDatabase();

    this.app.listen(this.port, () => {
      console.log(`🚀 Server started at http://localhost:${this.port}`);
      console.log(
        `📘 API Docs available at http://localhost:${this.port}/api-docs`,
      );
    });
  }

  /**
   * Devuelve la instancia de Express (para tests)
   * Ya tiene middlewares y rutas inicializados
   */
  public getApp(): Express {
    return this.app;
  }

  /**
   * Cierra conexiones (útil para tests)
   */
  public async close(): Promise<void> {
    if (PostgresDataSource.isInitialized) {
      await PostgresDataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}
