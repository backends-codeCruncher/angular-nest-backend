import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';
import { LoginResponse } from './interfaces';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'User logged succesfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Credential not valid',
  })
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(loginUserDto);
  }

  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  register(@Body() registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user',
  })
  findAll(@Request() req: Request): Promise<User[]> {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return  {
      user,
      token: this.authService.getJwtToken({id: user._id})
    }
  }
}
