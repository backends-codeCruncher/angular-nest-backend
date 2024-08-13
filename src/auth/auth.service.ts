import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcryptjs';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('AuthService');

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      const {password:_, ...user} = newUser.toJSON();

      return user;

    } catch (error) {
      if (error.code === 11000) {
        this.logger.error(`${createUserDto.email} already exists`);
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('Something terrible happened!');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private handleDbErrors(error: any) {}
}
