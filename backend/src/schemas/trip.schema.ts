import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TripStatus } from './index';

export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
export class Trip {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  source!: string;

  @Prop({ required: true, trim: true })
  destination!: string;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true, index: true })
  vehicle!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Driver', required: true, index: true })
  driver!: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  cargoWeightKg!: number;

  @Prop({ required: true, min: 0 })
  plannedDistanceKm!: number;

  @Prop({ min: 0 })
  finalOdometerKm?: number;

  @Prop({ min: 0 })
  fuelConsumedLiters?: number;

  @Prop({
    type: String,
    enum: TripStatus,
    default: TripStatus.DRAFT,
    index: true,
  })
  status!: TripStatus;

  @Prop()
  dispatchedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const TripSchema = SchemaFactory.createForClass(Trip);

TripSchema.index({ status: 1, createdAt: -1 });
