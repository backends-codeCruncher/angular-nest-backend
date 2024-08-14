import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'Sergio Barreras',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
