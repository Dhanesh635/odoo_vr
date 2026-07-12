import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from './index';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role!: UserRole;

  @Prop({ default: true })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
