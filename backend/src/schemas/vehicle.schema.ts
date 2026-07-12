import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VehicleStatus } from './index';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  _id!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true,
  })
  registrationNumber!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  type!: string;

  @Prop({ required: true, min: 0 })
  maxLoadCapacityKg!: number;

  @Prop({ required: true, min: 0, default: 0 })
  odometerKm!: number;

  @Prop({ required: true, min: 0 })
  acquisitionCost!: number;

  @Prop({
    type: String,
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
    index: true,
  })
  status!: VehicleStatus;

  @Prop({ trim: true, index: true })
  region?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ status: 1, type: 1, region: 1 });
