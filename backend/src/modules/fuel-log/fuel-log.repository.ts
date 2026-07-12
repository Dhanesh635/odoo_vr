import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { FuelLog, FuelLogDocument } from '../../schemas/fuel-log.schema';

@Injectable()
export class FuelLogRepository {
  constructor(
    @InjectModel(FuelLog.name)
    private readonly fuelLogModel: Model<FuelLogDocument>,
  ) {}

  create(data: Partial<FuelLog>, session?: ClientSession) {
    return this.fuelLogModel.create([data], { session }).then(([log]) => log);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.fuelLogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(filter: Record<string, unknown>) {
    return this.fuelLogModel.countDocuments(filter).exec();
  }
}
