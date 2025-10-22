import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: false, default: '' })
  firstName?: string;

  @Prop({ required: false, default: '' })
  lastName?: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ default: [] })
  refreshTokens?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);