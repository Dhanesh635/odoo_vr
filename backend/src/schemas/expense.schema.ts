import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExpenseType } from './index';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true, index: true })
  vehicle!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Trip' })
  trip?: Types.ObjectId;

  @Prop({ type: String, enum: ExpenseType, required: true })
  type!: ExpenseType;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({ required: true, default: () => new Date() })
  date!: Date;

  @Prop({ trim: true })
  description?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.index({ vehicle: 1, date: -1 });
