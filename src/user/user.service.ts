// src/user/user.service.ts
import { CreateUserDto } from './dtos/create-user.dto';
import { pokemonClient, PokemonBasicInfo } from '../clients/pokemon.client';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.emailExists(
      createUserDto.email,
    );

    if (emailExists) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.BCRYPT_ROUNDS || '10'),
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAllWithoutPassword();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findByIdWithoutPassword(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        parseInt(process.env.BCRYPT_ROUNDS || '10'),
      );
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('User not found');
    }
  }

  /**
   * Establecer pokemon favorito del usuario
   */
  async setFavoritePokemon(
    userId: string,
    pokemonNameOrId: string,
  ): Promise<{ user: User; pokemon: PokemonBasicInfo | null }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const pokemon = await pokemonClient.getPokemonBasicInfo(pokemonNameOrId);

    if (!pokemon) {
      throw new Error(`Pokemon "${pokemonNameOrId}" not found`);
    }

    const updatedUser = await this.userRepository.updateFavoritePokemon(
      userId,
      pokemon.name,
    );

    if (!updatedUser) {
      throw new Error('Error updating favorite pokemon');
    }

    return { user: updatedUser, pokemon };
  }

  /**
   * Obtener pokemon favorito del usuario con detalles
   */
  async getFavoritePokemon(userId: string): Promise<PokemonBasicInfo | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.favoritePokemon) {
      return null;
    }

    return await pokemonClient.getPokemonBasicInfo(user.favoritePokemon);
  }

  /**
   * Agregar pokemon al equipo (máximo 6)
   */
  async addPokemonToTeam(
    userId: string,
    pokemonNameOrId: string,
  ): Promise<{ user: User; pokemon: PokemonBasicInfo | null }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const pokemon = await pokemonClient.getPokemonBasicInfo(pokemonNameOrId);

    if (!pokemon) {
      throw new Error(`Pokemon "${pokemonNameOrId}" not found`);
    }

    if (!user.pokemonTeam) {
      user.pokemonTeam = [];
    }

    if (user.pokemonTeam.length >= 6) {
      throw new Error('Pokemon team is full (maximum 6 pokemon)');
    }

    if (user.pokemonTeam.includes(pokemon.name)) {
      throw new Error('Pokemon already in team');
    }

    user.pokemonTeam.push(pokemon.name);
    const updatedUser = await this.userRepository.updatePokemonTeam(
      userId,
      user.pokemonTeam,
    );

    if (!updatedUser) {
      throw new Error('Error updating pokemon team');
    }

    return { user: updatedUser, pokemon };
  }

  /**
   * Remover pokemon del equipo
   */
  async removePokemonFromTeam(
    userId: string,
    pokemonNameOrId: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.pokemonTeam || user.pokemonTeam.length === 0) {
      throw new Error('Pokemon team is empty');
    }

    const pokemon = await pokemonClient.getPokemonBasicInfo(pokemonNameOrId);

    if (!pokemon) {
      throw new Error(`Pokemon "${pokemonNameOrId}" not found`);
    }

    const filteredTeam = user.pokemonTeam.filter((p) => p !== pokemon.name);
    const updatedUser = await this.userRepository.updatePokemonTeam(
      userId,
      filteredTeam,
    );

    if (!updatedUser) {
      throw new Error('Error updating pokemon team');
    }

    return updatedUser;
  }

  /**
   * Obtener equipo completo con detalles
   */
  async getPokemonTeam(userId: string): Promise<PokemonBasicInfo[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.pokemonTeam || user.pokemonTeam.length === 0) {
      return [];
    }

    return await pokemonClient.getMultiplePokemon(user.pokemonTeam);
  }

  /**
   * Establecer equipo completo
   */
  async setPokemonTeam(userId: string, pokemonIds: string[]): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (pokemonIds.length > 6) {
      throw new Error('Pokemon team cannot have more than 6 pokemon');
    }

    const verifications = await Promise.all(
      pokemonIds.map((id) => pokemonClient.pokemonExists(id)),
    );

    if (verifications.some((exists) => !exists)) {
      throw new Error('One or more pokemon not found');
    }

    const pokemons = await pokemonClient.getMultiplePokemon(pokemonIds);
    const updatedUser = await this.userRepository.updatePokemonTeam(
      userId,
      pokemons.map((p) => p.name),
    );

    if (!updatedUser) {
      throw new Error('Error updating pokemon team');
    }

    return updatedUser;
  }

  /**
   * Asignar pokemon aleatorio al usuario
   */
  async assignRandomPokemon(
    userId: string,
  ): Promise<{ user: User; pokemon: PokemonBasicInfo | null }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const pokemon = await pokemonClient.getRandomPokemon();

    if (!pokemon) {
      throw new Error('Could not fetch random pokemon');
    }

    const updatedUser = await this.userRepository.updateFavoritePokemon(
      userId,
      pokemon.name,
    );

    if (!updatedUser) {
      throw new Error('Error updating favorite pokemon');
    }

    return { user: updatedUser, pokemon };
  }

  /**
   * Buscar usuarios con paginación
   */
  async findWithPagination(page: number = 1, limit: number = 10) {
    return await this.userRepository.findWithPagination(page, limit);
  }

  /**
   * Buscar usuarios por nombre
   */
  async searchByName(query: string): Promise<User[]> {
    return await this.userRepository.searchByName(query);
  }

  /**
   * Obtener estadísticas
   */
  async getStats() {
    return await this.userRepository.getStats();
  }

  /**
   * Desactivar usuario
   */
  async deactivate(userId: string): Promise<boolean> {
    return await this.userRepository.deactivate(userId);
  }

  /**
   * Activar usuario
   */
  async activate(userId: string): Promise<boolean> {
    return await this.userRepository.activate(userId);
  }

  /**
   * Buscar usuarios por pokemon favorito
   */
  async findByFavoritePokemon(pokemonName: string): Promise<User[]> {
    return await this.userRepository.findByFavoritePokemon(pokemonName);
  }

  /**
   * Buscar usuarios por pokemon en equipo
   */
  async findByPokemonInTeam(pokemonName: string): Promise<User[]> {
    return await this.userRepository.findByPokemonInTeam(pokemonName);
  }
}
