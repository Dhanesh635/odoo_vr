import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DriverStatus } from './index';

export type DriverDocument = Driver & Document;

@Schema({ timestamps: true })
export class Driver {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true, index: true })
  licenseNumber!: string;

  @Prop({ required: true, trim: true })
  licenseCategory!: string;

  @Prop({ required: true })
  licenseExpiryDate!: Date;

  @Prop({ required: true, trim: true })
  contactNumber!: string;

  @Prop({ min: 0, max: 100, default: 100 })
  safetyScore!: number;

  @Prop({
    type: String,
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
    index: true,
  })
  status!: DriverStatus;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.index({ status: 1, licenseExpiryDate: 1 });
