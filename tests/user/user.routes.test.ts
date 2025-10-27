// tests/user/user.routes.test.ts
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { pokemonClient } from '../../src/clients/pokemon.client';
import { PostgresDataSource } from '../../src/core/db/postgres';
import { Server } from '../../src/core/server';
import { ApiClient } from '../helpers/api-client';
import {
  clearDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from '../helpers/test-database';

// Mock del cliente de Pokémon
jest.mock('../../src/clients/pokemon.client');

describe('User Routes - Integration Tests', () => {
  let app: Express;
  let dataSource: DataSource;
  let api: ApiClient;

  const mockPokemonClient = pokemonClient as jest.Mocked<typeof pokemonClient>;

  beforeAll(async () => {
    try {
      dataSource = PostgresDataSource;
      await setupTestDatabase(dataSource);

      app = new Server().getApp();

      api = new ApiClient(app, '/api/v1');

      console.log('✅ Test environment ready');
    } catch (err) {
      console.error('❌ Failed to initialize database for tests:', err);
      throw err;
    }
  }, 30000);

  afterEach(async () => {
    await clearDatabase(dataSource);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await teardownTestDatabase(dataSource);
  }, 10000);

  // ==================== USER CRUD TESTS ====================

  describe('POST /users - Create User', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      const response = await api.post('/users').send(userData).expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: userData.email,
          name: userData.name,
          isActive: true,
        },
      });
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should fail when email already exists', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      // Crear primer usuario
      await api.post('/users').send(userData);

      // Intentar crear usuario duplicado
      const response = await api.post('/users').send(userData).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Email already exists',
      });
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      const response = await api.post('/users').send(userData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with short password', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: '123',
      };

      const response = await api.post('/users').send(userData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      const response = await api
        .post('/users')
        .send({ email: 'ash@pokemon.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /users - Get All Users', () => {
    it('should return empty array when no users exist', async () => {
      const response = await api.get('/users').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: [],
      });
    });

    it('should return all users', async () => {
      // Crear usuarios
      const users = [
        { email: 'ash@pokemon.com', name: 'Ash Ketchum', password: 'pass123' },
        { email: 'misty@pokemon.com', name: 'Misty', password: 'pass123' },
        { email: 'brock@pokemon.com', name: 'Brock', password: 'pass123' },
      ];

      for (const user of users) {
        await api.post('/users').send(user);
      }

      const response = await api.get('/users').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).not.toHaveProperty('password');
    });
  });

  describe('GET /users/:id - Get User by ID', () => {
    it('should return user by id', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      const createResponse = await api.post('/users').send(userData);

      const userId = createResponse.body.data.id;

      const response = await api.get(`/users/${userId}`).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: userId,
          email: userData.email,
          name: userData.name,
        },
      });
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await api.get(`/users/${fakeId}`).expect(404);

      expect(response.body).toMatchObject({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('PATCH /users/:id - Update User', () => {
    it('should update user name', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      const createResponse = await api.post('/users').send(userData);

      const userId = createResponse.body.data.id;

      const response = await api
        .patch(`/users/${userId}`)
        .send({ name: 'Ash Ketchum Updated' })
        .expect(200);

      expect(response.body.data.name).toBe('Ash Ketchum Updated');
      expect(response.body.data.email).toBe(userData.email);
    });

    it('should update user password', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      const createResponse = await api.post('/users').send(userData);

      const userId = createResponse.body.data.id;

      const response = await api
        .patch(`/users/${userId}`)
        .send({ password: 'newpassword123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should fail to update non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await api
        .patch(`/users/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('DELETE /users/:id - Delete User', () => {
    it('should delete user successfully', async () => {
      const userData = {
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      };

      const createResponse = await api.post('/users').send(userData);

      const userId = createResponse.body.data.id;

      const response = await api.delete(`/users/${userId}`).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'User deleted successfully',
      });

      // Verificar que el usuario fue eliminado
      await api.get(`/users/${userId}`).expect(404);
    });

    it('should fail to delete non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await api.delete(`/users/${fakeId}`).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'User not found',
      });
    });
  });

  // ==================== POKEMON ENDPOINTS TESTS ====================

  describe('POST /users/:id/favorite-pokemon - Set Favorite Pokemon', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should set favorite pokemon successfully', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        sprite:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        types: ['electric'],
      };

      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(mockPokemon);

      const response = await api
        .post(`/users/${userId}/favorite-pokemon`)
        .send({ pokemonNameOrId: 'pikachu' })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Favorite pokemon set successfully',
        data: {
          user: {
            id: userId,
            favoritePokemon: 'pikachu',
          },
          pokemon: mockPokemon,
        },
      });
    });

    it('should fail when pokemon does not exist', async () => {
      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(null);

      const response = await api
        .post(`/users/${userId}/favorite-pokemon`)
        .send({ pokemonNameOrId: 'fakemon' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Pokemon "fakemon" not found',
      });
    });

    it('should fail when user does not exist', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await api
        .post(`/users/${fakeId}/favorite-pokemon`)
        .send({ pokemonNameOrId: 'pikachu' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('GET /users/:id/favorite-pokemon - Get Favorite Pokemon', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should get favorite pokemon', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        sprite:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        types: ['electric'],
      };

      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(mockPokemon);

      // Establecer favorito
      await api
        .post(`/users/${userId}/favorite-pokemon`)
        .send({ pokemonNameOrId: 'pikachu' });

      // Obtener favorito
      const response = await api
        .get(`/users/${userId}/favorite-pokemon`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockPokemon,
      });
    });

    it('should return 404 when user has no favorite pokemon', async () => {
      const response = await api
        .get(`/users/${userId}/favorite-pokemon`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        message: 'User has no favorite pokemon',
      });
    });
  });

  describe('POST /users/:id/pokemon-team - Add Pokemon to Team', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should add pokemon to team successfully', async () => {
      const mockPokemon = {
        id: 6,
        name: 'charizard',
        sprite:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
        types: ['fire', 'flying'],
      };

      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(mockPokemon);

      const response = await api
        .post(`/users/${userId}/pokemon-team`)
        .send({ pokemonNameOrId: 'charizard' })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Pokemon added to team',
        data: {
          user: {
            pokemonTeam: ['charizard'],
          },
          pokemon: mockPokemon,
        },
      });
    });

    it('should fail when team is full (6 pokemon)', async () => {
      const mockPokemons = [
        { id: 1, name: 'bulbasaur', sprite: 'url1', types: ['grass'] },
        { id: 2, name: 'ivysaur', sprite: 'url2', types: ['grass'] },
        { id: 3, name: 'venusaur', sprite: 'url3', types: ['grass'] },
        { id: 4, name: 'charmander', sprite: 'url4', types: ['fire'] },
        { id: 5, name: 'charmeleon', sprite: 'url5', types: ['fire'] },
        { id: 6, name: 'charizard', sprite: 'url6', types: ['fire'] },
      ];

      // Agregar 6 pokemon
      for (const pokemon of mockPokemons) {
        mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(pokemon);
        await api
          .post(`/users/${userId}/pokemon-team`)
          .send({ pokemonNameOrId: pokemon.name });
      }

      // Intentar agregar el 7mo
      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue({
        id: 7,
        name: 'squirtle',
        sprite: 'url7',
        types: ['water'],
      });

      const response = await api
        .post(`/users/${userId}/pokemon-team`)
        .send({ pokemonNameOrId: 'squirtle' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Pokemon team is full (maximum 6 pokemon)',
      });
    });

    it('should fail when pokemon is already in team', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        sprite: 'url',
        types: ['electric'],
      };

      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(mockPokemon);

      // Agregar pokemon
      await api
        .post(`/users/${userId}/pokemon-team`)
        .send({ pokemonNameOrId: 'pikachu' });

      // Intentar agregarlo nuevamente
      const response = await api
        .post(`/users/${userId}/pokemon-team`)
        .send({ pokemonNameOrId: 'pikachu' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Pokemon already in team',
      });
    });
  });

  describe('DELETE /users/:id/pokemon-team/:pokemonNameOrId - Remove Pokemon from Team', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should remove pokemon from team successfully', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        sprite: 'url',
        types: ['electric'],
      };

      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(mockPokemon);

      // Agregar pokemon
      await api
        .post(`/users/${userId}/pokemon-team`)
        .send({ pokemonNameOrId: 'pikachu' });

      // Remover pokemon
      const response = await api
        .delete(`/users/${userId}/pokemon-team/pikachu`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Pokemon removed from team',
        data: {
          pokemonTeam: [],
        },
      });
    });

    it('should fail when team is empty', async () => {
      mockPokemonClient.getPokemonBasicInfo.mockResolvedValue({
        id: 25,
        name: 'pikachu',
        sprite: 'url',
        types: ['electric'],
      });

      const response = await api
        .delete(`/users/${userId}/pokemon-team/pikachu`)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Pokemon team is empty',
      });
    });
  });

  describe('GET /users/:id/pokemon-team - Get Pokemon Team', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should get pokemon team with details', async () => {
      const mockPokemons = [
        { id: 25, name: 'pikachu', sprite: 'url1', types: ['electric'] },
        { id: 6, name: 'charizard', sprite: 'url2', types: ['fire', 'flying'] },
      ];

      // Agregar pokemon al equipo
      for (const pokemon of mockPokemons) {
        mockPokemonClient.getPokemonBasicInfo.mockResolvedValue(pokemon);
        await api
          .post(`/users/${userId}/pokemon-team`)
          .send({ pokemonNameOrId: pokemon.name });
      }

      // Mock para obtener múltiples pokemon
      mockPokemonClient.getMultiplePokemon.mockResolvedValue(mockPokemons);

      const response = await api
        .get(`/users/${userId}/pokemon-team`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockPokemons,
      });
    });

    it('should return empty array when team is empty', async () => {
      const response = await api
        .get(`/users/${userId}/pokemon-team`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: [],
      });
    });
  });

  describe('PUT /users/:id/pokemon-team - Set Complete Pokemon Team', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should set complete pokemon team successfully', async () => {
      const pokemonIds = ['pikachu', 'charizard', 'blastoise'];
      const mockPokemons = [
        { id: 25, name: 'pikachu', sprite: 'url1', types: ['electric'] },
        { id: 6, name: 'charizard', sprite: 'url2', types: ['fire'] },
        { id: 9, name: 'blastoise', sprite: 'url3', types: ['water'] },
      ];

      mockPokemonClient.pokemonExists.mockResolvedValue(true);
      mockPokemonClient.getMultiplePokemon.mockResolvedValue(mockPokemons);

      const response = await api
        .put(`/users/${userId}/pokemon-team`)
        .send({ pokemonIds })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Pokemon team set successfully',
        data: {
          pokemonTeam: ['pikachu', 'charizard', 'blastoise'],
        },
      });
    });

    it('should fail when more than 6 pokemon provided', async () => {
      const pokemonIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];

      const response = await api
        .put(`/users/${userId}/pokemon-team`)
        .send({ pokemonIds })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        errors: [
          {
            constraints: ['Pokemon team cannot have more than 6 pokemon'],
          },
        ],
      });
    });

    it('should fail when one or more pokemon not found', async () => {
      mockPokemonClient.pokemonExists
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const response = await api
        .put(`/users/${userId}/pokemon-team`)
        .send({ pokemonIds: ['pikachu', 'fakemon'] })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'One or more pokemon not found',
      });
    });
  });

  describe('POST /users/:id/random-pokemon - Assign Random Pokemon', () => {
    let userId: string;

    beforeEach(async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
      userId = createResponse.body.data.id;
    });

    it('should assign random pokemon successfully', async () => {
      const mockPokemon = {
        id: 150,
        name: 'mewtwo',
        sprite: 'url',
        types: ['psychic'],
      };

      mockPokemonClient.getRandomPokemon.mockResolvedValue(mockPokemon);

      const response = await api
        .post(`/users/${userId}/random-pokemon`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Random pokemon assigned',
        data: {
          user: {
            favoritePokemon: 'mewtwo',
          },
          pokemon: mockPokemon,
        },
      });
    });

    it('should fail when random pokemon fetch fails', async () => {
      mockPokemonClient.getRandomPokemon.mockResolvedValue(null);

      const response = await api
        .post(`/users/${userId}/random-pokemon`)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Could not fetch random pokemon',
      });
    });
  });

  // ==================== ADDITIONAL ENDPOINTS TESTS ====================

  describe('GET /users/stats - Get User Statistics', () => {
    it('should return user statistics', async () => {
      // Crear algunos usuarios
      await api.post('/users').send({
        email: 'user1@test.com',
        name: 'User 1',
        password: 'pass123',
      });

      const response = await api.get('/users/stats').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          total: expect.any(Number),
          active: expect.any(Number),
          inactive: expect.any(Number),
          withFavoritePokemon: expect.any(Number),
          withTeam: expect.any(Number),
        },
      });
    });
  });

  describe('GET /users/search - Search Users by Name', () => {
    beforeEach(async () => {
      // Crear usuarios para buscar
      await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pass123',
      });

      await api.post('/users').send({
        email: 'misty@pokemon.com',
        name: 'Misty Williams',
        password: 'pass123',
      });
    });

    it('should search users by name', async () => {
      const response = await api.get('/users/search?query=ash').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('Ash');
    });

    it('should fail without query parameter', async () => {
      const response = await api.get('/users/search').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Query parameter is required',
      });
    });
  });

  describe('POST /users/:id/deactivate - Deactivate User', () => {
    it('should deactivate user successfully', async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pass123',
      });

      const userId = createResponse.body.data.id;

      const response = await api
        .post(`/users/${userId}/deactivate`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'User deactivated successfully',
      });

      // Verificar que el usuario está desactivado
      const userResponse = await api.get(`/users/${userId}`);
      expect(userResponse.body.data.isActive).toBe(false);
    });
  });

  describe('POST /users/:id/activate - Activate User', () => {
    it('should activate user successfully', async () => {
      const createResponse = await api.post('/users').send({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pass123',
      });

      const userId = createResponse.body.data.id;

      // Desactivar primero
      await api.post(`/users/${userId}/deactivate`);

      // Activar
      const response = await api.post(`/users/${userId}/activate`).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'User activated successfully',
      });

      // Verificar que el usuario está activo
      const userResponse = await api.get(`/users/${userId}`);
      expect(userResponse.body.data.isActive).toBe(true);
    });
  });
});
