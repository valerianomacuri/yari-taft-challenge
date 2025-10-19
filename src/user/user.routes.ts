import { Router } from 'express';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CreateUserDto } from './dtos/create-user.dto';
import { validationMiddleware } from '../core/helpers';

const userRouter = Router();
const userService = new UserService();
const userController = new UserController(userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: El ID autogenerado del usuario.
 *           example: 'clq9v5g8d0000t6u4c8h0a1b2'
 *         name:
 *           type: string
 *           description: El nombre del usuario.
 *           example: 'Juan Pérez'
 *         email:
 *           type: string
 *           description: El correo electrónico del usuario.
 *           example: 'juan.perez@example.com'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: La fecha de creación del usuario.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna la lista de todos los usuarios
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: La lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

userRouter.get('/', userController.findAll);

userRouter.get('/:id', userController.findById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: El usuario fue creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Ocurrió un error en el servidor.
 */

userRouter.post(
  '/',
  validationMiddleware(CreateUserDto),
  userController.create,
);

export default userRouter;
