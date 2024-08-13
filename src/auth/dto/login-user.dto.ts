import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
