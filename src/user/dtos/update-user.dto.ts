// src/user/dto/update-user.dto.ts
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({})
  email?: string;

  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
