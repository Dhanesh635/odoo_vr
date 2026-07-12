import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  MaintenanceLog,
  MaintenanceLogDocument,
} from '../../schemas/maintenance-log.schema';

@Injectable()
export class MaintenanceLogRepository {
  constructor(
    @InjectModel(MaintenanceLog.name)
    private readonly maintenanceModel: Model<MaintenanceLogDocument>,
  ) {}

  create(data: Partial<MaintenanceLog>, session?: ClientSession) {
    return this.maintenanceModel
      .create([data], { session })
      .then(([log]) => log);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.maintenanceModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(filter: Record<string, unknown>) {
    return this.maintenanceModel.countDocuments(filter).exec();
  }

  findById(id: string) {
    return this.maintenanceModel.findById(id).exec();
  }

  findByIdAndUpdate(
    id: string,
    update: Partial<MaintenanceLog>,
    session?: ClientSession,
  ) {
    return this.maintenanceModel
      .findByIdAndUpdate(id, update, { new: true, session })
      .exec();
  }
}
