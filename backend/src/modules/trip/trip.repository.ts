import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Trip, TripDocument } from '../../schemas/trip.schema';

@Injectable()
export class TripRepository {
  constructor(
    @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
  ) {}

  create(data: Partial<Trip>, session?: ClientSession) {
    return this.tripModel.create([data], { session }).then(([trip]) => trip);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.tripModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(filter: Record<string, unknown>) {
    return this.tripModel.countDocuments(filter).exec();
  }

  findById(id: string) {
    return this.tripModel.findById(id).exec();
  }

  findByIdAndUpdate(
    id: string,
    update: Partial<Trip>,
    session?: ClientSession,
  ) {
    return this.tripModel
      .findByIdAndUpdate(id, update, { new: true, session })
      .exec();
  }

  deleteById(id: string, session?: ClientSession) {
    return this.tripModel.findByIdAndDelete(id, { session }).exec();
  }
}
