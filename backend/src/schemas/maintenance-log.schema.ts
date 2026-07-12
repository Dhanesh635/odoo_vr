import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MaintenanceStatus } from './index';

export type MaintenanceLogDocument = MaintenanceLog & Document;

@Schema({ timestamps: true })
export class MaintenanceLog {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true, index: true })
  vehicle!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  serviceType!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 0, default: 0 })
  cost!: number;

  @Prop({ required: true, default: () => new Date() })
  startDate!: Date;

  @Prop()
  endDate?: Date;

  @Prop({
    type: String,
    enum: MaintenanceStatus,
    default: MaintenanceStatus.ACTIVE,
    index: true,
  })
  status!: MaintenanceStatus;
}

export const MaintenanceLogSchema =
  SchemaFactory.createForClass(MaintenanceLog);

MaintenanceLogSchema.index({ vehicle: 1, status: 1 });
