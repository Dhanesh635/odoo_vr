import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { VehicleStatus } from '../../schemas';
import { FuelLog, FuelLogDocument } from '../../schemas/fuel-log.schema';
import {
  MaintenanceLog,
  MaintenanceLogDocument,
} from '../../schemas/maintenance-log.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(FuelLog.name)
    private readonly fuelLogModel: Model<FuelLogDocument>,
    @InjectModel(MaintenanceLog.name)
    private readonly maintenanceLogModel: Model<MaintenanceLogDocument>,
  ) {}

  create(data: Partial<Vehicle>) {
    return this.vehicleModel.create(data);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.vehicleModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(filter: Record<string, unknown>) {
    return this.vehicleModel.countDocuments(filter).exec();
  }

  findById(id: string) {
    return this.vehicleModel.findById(id).exec();
  }

  findByIdAndUpdate(
    id: string,
    update: Partial<Vehicle>,
    session?: ClientSession,
  ) {
    return this.vehicleModel
      .findByIdAndUpdate(id, update, { new: true, session })
      .exec();
  }

  softDelete(id: string, session?: ClientSession) {
    return this.vehicleModel
      .findByIdAndUpdate(
        id,
        { status: VehicleStatus.RETIRED },
        { new: true, session },
      )
      .exec();
  }

  findAvailable(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.vehicleModel
      .find({ ...filter, status: VehicleStatus.AVAILABLE })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getOperationalCost(vehicleId: string) {
    const objectId = new Types.ObjectId(vehicleId);

    const [fuelResult, maintenanceResult] = await Promise.all([
      this.fuelLogModel.aggregate([
        { $match: { vehicle: objectId } },
        { $group: { _id: null, total: { $sum: '$cost' } } },
      ]),
      this.maintenanceLogModel.aggregate([
        { $match: { vehicle: objectId } },
        { $group: { _id: null, total: { $sum: '$cost' } } },
      ]),
    ]);

    const fuelTotals = fuelResult as Array<{ total?: number }>;
    const maintenanceTotals = maintenanceResult as Array<{ total?: number }>;

    return {
      fuelCost: fuelTotals[0]?.total ?? 0,
      maintenanceCost: maintenanceTotals[0]?.total ?? 0,
    };
  }
}
