import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('AuthService');

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      return user.save();
    } catch (error) {
      if (error.code === 11000) throw new BadRequestException(error.detail);
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

  private handleDBException(error: any) {
    this.logger.error(error.detail);
    switch (error.code) {
      case 11000:

      default:
        throw new InternalServerErrorException('Error en servicio de Usuarios');
    }
  }
}
