import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { DriverStatus } from '../../schemas';
import { Driver, DriverDocument } from '../../schemas/driver.schema';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,
  ) {}

  create(data: Partial<Driver>) {
    return this.driverModel.create(data);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.driverModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(filter: Record<string, unknown>) {
    return this.driverModel.countDocuments(filter).exec();
  }

  findById(id: string) {
    return this.driverModel.findById(id).exec();
  }

  findByIdAndUpdate(
    id: string,
    update: Partial<Driver>,
    session?: ClientSession,
  ) {
    return this.driverModel
      .findByIdAndUpdate(id, update, { new: true, session })
      .exec();
  }

  findAvailable(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.driverModel
      .find({
        ...filter,
        status: DriverStatus.AVAILABLE,
        licenseExpiryDate: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  findExpiringWithin(days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return this.driverModel
      .find({
        licenseExpiryDate: { $lte: cutoff, $gte: new Date() },
        status: { $ne: DriverStatus.SUSPENDED },
      })
      .sort({ licenseExpiryDate: 1 })
      .exec();
  }

  softDelete(id: string, session?: ClientSession) {
    return this.driverModel
      .findByIdAndUpdate(
        id,
        { status: DriverStatus.SUSPENDED },
        { new: true, session },
      )
      .exec();
  }
}
