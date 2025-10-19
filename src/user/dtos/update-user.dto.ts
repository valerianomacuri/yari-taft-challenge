import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  public name?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;
}
