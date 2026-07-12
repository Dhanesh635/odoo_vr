import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FuelLogDocument = FuelLog & Document;

@Schema({ timestamps: true })
export class FuelLog {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true, index: true })
  vehicle!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Trip' })
  trip?: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  liters!: number;

  @Prop({ required: true, min: 0 })
  cost!: number;

  @Prop({ required: true, default: () => new Date() })
  date!: Date;
}

export const FuelLogSchema = SchemaFactory.createForClass(FuelLog);

FuelLogSchema.index({ vehicle: 1, date: -1 });
