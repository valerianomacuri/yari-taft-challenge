// src/clients/pokemon.client.ts
import axios from 'axios';
import envVars from '../core/envs';

export interface PokemonBasicInfo {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonDetails extends PokemonBasicInfo {
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  abilities: string[];
}

export class PokemonClient {
  private api: any;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 10 * 60 * 1000;

  constructor() {
    this.api = axios.create({
      baseURL: envVars.POKEMON_API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Verificar si un error es de axios (compatible con todas las versiones)
   */
  private isAxiosError(error: any): boolean {
    return error && error.isAxiosError === true;
  }

  async getPokemonBasicInfo(
    nameOrId: string | number,
  ): Promise<PokemonBasicInfo | null> {
    const cacheKey = `pokemon-basic-${nameOrId}`;
    const cached = this.getCached<PokemonBasicInfo>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await this.api.get(`/pokemon/${nameOrId}`);
      const data = response.data;

      const pokemonInfo: PokemonBasicInfo = {
        id: data.id,
        name: data.name,
        sprite:
          data.sprites.front_default ||
          data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
      };

      this.setCache(cacheKey, pokemonInfo);
      return pokemonInfo;
    } catch (error: any) {
      // Método compatible con todas las versiones
      if (this.isAxiosError(error) || error.response) {
        if (error.response?.status === 404) {
          return null;
        }
        console.error('Error fetching pokemon:', error.message);
      }
      return null;
    }
  }

  async getPokemonDetails(
    nameOrId: string | number,
  ): Promise<PokemonDetails | null> {
    const cacheKey = `pokemon-details-${nameOrId}`;
    const cached = this.getCached<PokemonDetails>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await this.api.get(`/pokemon/${nameOrId}`);
      const data = response.data;

      const stats = data.stats.reduce((acc: any, stat: any) => {
        const statName = stat.stat.name;
        if (statName === 'hp') acc.hp = stat.base_stat;
        if (statName === 'attack') acc.attack = stat.base_stat;
        if (statName === 'defense') acc.defense = stat.base_stat;
        if (statName === 'speed') acc.speed = stat.base_stat;
        return acc;
      }, {});

      const pokemonDetails: PokemonDetails = {
        id: data.id,
        name: data.name,
        sprite:
          data.sprites.front_default ||
          data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
        stats,
        abilities: data.abilities.map((a: any) => a.ability.name),
      };

      this.setCache(cacheKey, pokemonDetails);
      return pokemonDetails;
    } catch (error: any) {
      if (this.isAxiosError(error) || error.response) {
        if (error.response?.status === 404) {
          return null;
        }
        console.error('Error fetching pokemon details:', error.message);
      }
      return null;
    }
  }

  async pokemonExists(nameOrId: string | number): Promise<boolean> {
    const pokemon = await this.getPokemonBasicInfo(nameOrId);
    return pokemon !== null;
  }

  async getRandomPokemon(): Promise<PokemonBasicInfo | null> {
    const randomId = Math.floor(Math.random() * 898) + 1;
    return await this.getPokemonBasicInfo(randomId);
  }

  async getMultiplePokemon(
    ids: (string | number)[],
  ): Promise<PokemonBasicInfo[]> {
    const promises = ids.map((id) => this.getPokemonBasicInfo(id));
    const results = await Promise.allSettled(promises);

    return results
      .filter(
        (result) => result.status === 'fulfilled' && result.value !== null,
      )
      .map(
        (result) => (result as PromiseFulfilledResult<PokemonBasicInfo>).value,
      );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const pokemonClient = new PokemonClient();
