// src/user/dto/add-pokemon-team.dto.ts
import { IsString, IsNotEmpty, IsArray, ArrayMaxSize } from 'class-validator';

export class AddPokemonToTeamDto {
  @IsString()
  @IsNotEmpty()
  pokemonNameOrId!: string;
}

export class SetPokemonTeamDto {
  @IsArray()
  @ArrayMaxSize(6, { message: 'Pokemon team cannot have more than 6 pokemon' })
  @IsString({ each: true })
  pokemonIds!: string[];
}
