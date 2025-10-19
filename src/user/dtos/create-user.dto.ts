import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  public name!: string;

  @IsEmail()
  @IsNotEmpty()
  public email!: string;
}
