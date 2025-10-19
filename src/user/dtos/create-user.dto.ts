// src/user/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({})
  email!: string;

  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
