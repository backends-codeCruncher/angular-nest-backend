import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User {
  _id?: string;

  @ApiProperty({
    description: 'User email',
    uniqueItems: true,
  })
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty({
    description: 'User name',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'User password',
  })
  @Prop({ minlength: 6, required: true })
  password?: string;

  @ApiProperty({
    description: 'User active',
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User roles',
    example: ['user', 'admin'],
  })
  @Prop({ type: [String], default: ['user'] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
