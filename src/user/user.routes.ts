// src/user/user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { validationMiddleware } from '../core/middlewares';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SetFavoritePokemonDto } from './dtos/set-favorite-pokemon.dto';
import {
  AddPokemonToTeamDto,
  SetPokemonTeamDto,
} from './dtos/add-pokemon-team.dto';

const router = Router();
const userController = new UserController();

// ==================== USER CRUD ====================

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 *   - name: User Pokemon
 *     description: User pokemon management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User unique identifier
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         name:
 *           type: string
 *           description: User full name
 *         isActive:
 *           type: boolean
 *           description: User account status
 *         favoritePokemon:
 *           type: string
 *           nullable: true
 *           description: User's favorite pokemon name
 *         pokemonTeam:
 *           type: array
 *           items:
 *             type: string
 *           description: User's pokemon team (max 6)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         email: ash@pokemon.com
 *         name: Ash Ketchum
 *         isActive: true
 *         favoritePokemon: pikachu
 *         pokemonTeam: ["pikachu", "charizard", "blastoise"]
 *         createdAt: 2024-01-01T00:00:00.000Z
 *         updatedAt: 2024-01-01T00:00:00.000Z
 *
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email (must be unique)
 *         name:
 *           type: string
 *           minLength: 2
 *           description: User full name
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User password
 *       example:
 *         email: ash@pokemon.com
 *         name: Ash Ketchum
 *         password: pikachu123
 *
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *           minLength: 2
 *         password:
 *           type: string
 *           minLength: 6
 *       example:
 *         name: Ash Ketchum Updated
 *
 *     PokemonBasicInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Pokemon ID
 *         name:
 *           type: string
 *           description: Pokemon name
 *         sprite:
 *           type: string
 *           description: Pokemon sprite URL
 *         types:
 *           type: array
 *           items:
 *             type: string
 *           description: Pokemon types
 *       example:
 *         id: 25
 *         name: pikachu
 *         sprite: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png
 *         types: ["electric"]
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user in the system
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validationMiddleware(CreateUserDto), userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', userController.findAll);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', userController.searchByName);

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', userController.getStats);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', userController.findOne);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     description: Update user information (partial update)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  '/:id',
  validationMiddleware(UpdateUserDto),
  userController.update,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Permanently delete a user from the system
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', userController.remove);

// ==================== POKEMON ENDPOINTS ====================

/**
 * @swagger
 * /users/{id}/favorite-pokemon:
 *   post:
 *     summary: Set favorite pokemon
 *     description: Set or update the user's favorite pokemon
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonNameOrId
 *             properties:
 *               pokemonNameOrId:
 *                 type: string
 *                 description: Pokemon name or ID
 *                 example: pikachu
 *     responses:
 *       200:
 *         description: Favorite pokemon set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Favorite pokemon set successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     pokemon:
 *                       $ref: '#/components/schemas/PokemonBasicInfo'
 *       400:
 *         description: User not found or pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/:id/favorite-pokemon',
  validationMiddleware(SetFavoritePokemonDto),
  userController.setFavoritePokemon,
);

/**
 * @swagger
 * /users/{id}/favorite-pokemon:
 *   get:
 *     summary: Get favorite pokemon
 *     description: Retrieve the user's favorite pokemon with details
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     responses:
 *       200:
 *         description: Favorite pokemon retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PokemonBasicInfo'
 *       404:
 *         description: User has no favorite pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/favorite-pokemon', userController.getFavoritePokemon);

/**
 * @swagger
 * /users/{id}/pokemon-team:
 *   post:
 *     summary: Add pokemon to team
 *     description: Add a pokemon to the user's team (maximum 6 pokemon)
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonNameOrId
 *             properties:
 *               pokemonNameOrId:
 *                 type: string
 *                 description: Pokemon name or ID
 *                 example: charizard
 *     responses:
 *       200:
 *         description: Pokemon added to team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pokemon added to team
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     pokemon:
 *                       $ref: '#/components/schemas/PokemonBasicInfo'
 *       400:
 *         description: Team is full, pokemon not found, or already in team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               teamFull:
 *                 value:
 *                   success: false
 *                   message: Pokemon team is full (maximum 6 pokemon)
 *               pokemonNotFound:
 *                 value:
 *                   success: false
 *                   message: Pokemon "xyz" not found
 *               duplicate:
 *                 value:
 *                   success: false
 *                   message: Pokemon already in team
 */
router.post(
  '/:id/pokemon-team',
  validationMiddleware(AddPokemonToTeamDto),
  userController.addPokemonToTeam,
);

/**
 * @swagger
 * /users/{id}/pokemon-team/{pokemonNameOrId}:
 *   delete:
 *     summary: Remove pokemon from team
 *     description: Remove a specific pokemon from the user's team
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *       - in: path
 *         name: pokemonNameOrId
 *         required: true
 *         schema:
 *           type: string
 *         description: Pokemon name or ID to remove
 *         example: pikachu
 *     responses:
 *       200:
 *         description: Pokemon removed from team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pokemon removed from team
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found, team is empty, or pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id/pokemon-team/:pokemonNameOrId',
  userController.removePokemonFromTeam,
);

/**
 * @swagger
 * /users/{id}/pokemon-team:
 *   get:
 *     summary: Get pokemon team
 *     description: Retrieve the user's complete pokemon team with details
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     responses:
 *       200:
 *         description: Pokemon team retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PokemonBasicInfo'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/pokemon-team', userController.getPokemonTeam);

/**
 * @swagger
 * /users/{id}/pokemon-team:
 *   put:
 *     summary: Set complete pokemon team
 *     description: Replace the user's entire pokemon team (maximum 6 pokemon)
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonIds
 *             properties:
 *               pokemonIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 6
 *                 description: Array of pokemon names or IDs
 *                 example: ["pikachu", "charizard", "blastoise", "venusaur"]
 *     responses:
 *       200:
 *         description: Pokemon team set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pokemon team set successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Too many pokemon or one or more pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id/pokemon-team',
  validationMiddleware(SetPokemonTeamDto),
  userController.setPokemonTeam,
);

/**
 * @swagger
 * /users/{id}/random-pokemon:
 *   post:
 *     summary: Assign random pokemon
 *     description: Assign a random pokemon as the user's favorite
 *     tags: [User Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     responses:
 *       200:
 *         description: Random pokemon assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Random pokemon assigned
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     pokemon:
 *                       $ref: '#/components/schemas/PokemonBasicInfo'
 *       400:
 *         description: User not found or error fetching random pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/random-pokemon', userController.assignRandomPokemon);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   post:
 *     summary: Deactivate user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.post('/:id/deactivate', userController.deactivate);

/**
 * @swagger
 * /users/{id}/activate:
 *   post:
 *     summary: Activate user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User activated
 */
router.post('/:id/activate', userController.activate);

export default router;
