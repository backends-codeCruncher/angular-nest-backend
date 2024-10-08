import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';
import { JwtPayload, LoginResponse } from './interfaces';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('AuthService');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if (error.code === 11000) {
        this.logger.error(`${createUserDto.email} already exists`);
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('Something terrible happened!');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Not valid credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    const { password: _, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);

    return {
      user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
