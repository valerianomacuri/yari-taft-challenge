// src/user/user.repository.ts
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PostgresDataSource } from '../core/db';

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, PostgresDataSource.manager);
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({
      where: { email },
    });
  }

  /**
   * Buscar usuarios activos
   */
  async findAllActive(): Promise<User[]> {
    return await this.find({
      where: { isActive: true },
      select: [
        'id',
        'email',
        'name',
        'isActive',
        'favoritePokemon',
        'pokemonTeam',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  /**
   * Buscar usuario por ID sin password
   */
  async findByIdWithoutPassword(id: string): Promise<User | null> {
    return await this.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'name',
        'isActive',
        'favoritePokemon',
        'pokemonTeam',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  /**
   * Buscar todos sin password
   */
  async findAllWithoutPassword(): Promise<User[]> {
    return await this.find({
      select: [
        'id',
        'email',
        'name',
        'isActive',
        'favoritePokemon',
        'pokemonTeam',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  /**
   * Verificar si existe un email
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Buscar usuarios por pokemon favorito
   */
  async findByFavoritePokemon(pokemonName: string): Promise<User[]> {
    return await this.find({
      where: { favoritePokemon: pokemonName },
      select: ['id', 'email', 'name', 'favoritePokemon', 'createdAt'],
    });
  }

  /**
   * Buscar usuarios que tengan un pokemon específico en su equipo
   */
  async findByPokemonInTeam(pokemonName: string): Promise<User[]> {
    return await this.createQueryBuilder('user')
      .where(':pokemon = ANY(user.pokemon_team)', { pokemon: pokemonName })
      .select(['user.id', 'user.email', 'user.name', 'user.pokemon_team'])
      .getMany();
  }

  /**
   * Contar usuarios activos
   */
  async countActive(): Promise<number> {
    return await this.count({
      where: { isActive: true },
    });
  }

  /**
   * Actualizar pokemon favorito
   */
  async updateFavoritePokemon(
    userId: string,
    pokemonName: string,
  ): Promise<User | null> {
    await this.update(userId, { favoritePokemon: pokemonName });
    return await this.findByIdWithoutPassword(userId);
  }

  /**
   * Actualizar equipo pokemon
   */
  async updatePokemonTeam(
    userId: string,
    pokemonTeam: string[],
  ): Promise<User | null> {
    await this.update(userId, { pokemonTeam });
    return await this.findByIdWithoutPassword(userId);
  }

  /**
   * Desactivar usuario (soft delete)
   */
  async deactivate(userId: string): Promise<boolean> {
    const result = await this.update(userId, { isActive: false });
    return result.affected !== undefined && result.affected > 0;
  }

  /**
   * Activar usuario
   */
  async activate(userId: string): Promise<boolean> {
    const result = await this.update(userId, { isActive: true });
    return result.affected !== undefined && result.affected > 0;
  }

  /**
   * Buscar usuarios con paginación
   */
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.findAndCount({
      select: [
        'id',
        'email',
        'name',
        'isActive',
        'favoritePokemon',
        'pokemonTeam',
        'createdAt',
        'updatedAt',
      ],
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar usuarios por nombre (parcial)
   */
  async searchByName(query: string): Promise<User[]> {
    return await this.createQueryBuilder('user')
      .where('LOWER(user.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.isActive',
        'user.createdAt',
      ])
      .getMany();
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withFavoritePokemon: number;
    withTeam: number;
  }> {
    const total = await this.count();
    const active = await this.count({ where: { isActive: true } });
    const inactive = await this.count({ where: { isActive: false } });

    const withFavoritePokemon = await this.createQueryBuilder('user')
      .where('user.favorite_pokemon IS NOT NULL')
      .getCount();

    const withTeam = await this.createQueryBuilder('user')
      .where('user.pokemon_team IS NOT NULL')
      .andWhere("array_length(string_to_array(user.pokemon_team, ','), 1) > 0")
      .getCount();

    return {
      total,
      active,
      inactive,
      withFavoritePokemon,
      withTeam,
    };
  }
}
