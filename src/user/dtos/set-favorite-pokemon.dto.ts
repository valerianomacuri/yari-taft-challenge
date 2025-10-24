// src/user/dto/set-favorite-pokemon.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class SetFavoritePokemonDto {
  @IsString()
  @IsNotEmpty()
  pokemonNameOrId!: string;
}
