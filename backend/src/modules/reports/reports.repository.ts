import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MaintenanceLog,
  MaintenanceLogDocument,
} from '../../schemas/maintenance-log.schema';
import { FuelLog, FuelLogDocument } from '../../schemas/fuel-log.schema';
import { Trip, TripDocument } from '../../schemas/trip.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { TripStatus, VehicleStatus } from '../../schemas';

type DateRange = { $gte?: Date; $lte?: Date };

// Shapes of the `$group` stage outputs. Passing these as the generic on
// `.aggregate<T>()` is what removes the `any` — without it Mongoose types
// aggregate results as `any[]`, which is what triggered every lint error
// below (no-unsafe-assignment / no-unsafe-member-access on `.liters`,
// `.distance`, `.total`, `.revenue`).
interface SumResult {
  _id: null;
  total: number;
}

interface FuelLitersResult {
  _id: null;
  liters: number;
}

interface TripDistanceResult {
  _id: null;
  distance: number;
}

interface TripRevenueResult {
  _id: null;
  revenue: number;
}

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
    @InjectModel(FuelLog.name)
    private readonly fuelLogModel: Model<FuelLogDocument>,
    @InjectModel(MaintenanceLog.name)
    private readonly maintenanceLogModel: Model<MaintenanceLogDocument>,
  ) {}

  private buildDateRange(
    query: Record<string, unknown>,
  ): DateRange | undefined {
    if (typeof query.from !== 'string' && typeof query.to !== 'string') {
      return undefined;
    }

    const range: DateRange = {};

    if (typeof query.from === 'string') {
      range.$gte = new Date(query.from);
    }

    if (typeof query.to === 'string') {
      range.$lte = new Date(query.to);
    }

    return range;
  }

  private async getTargetVehicles(query: Record<string, unknown>) {
    if (typeof query.vehicle === 'string') {
      const vehicle = await this.vehicleModel.findById(query.vehicle).exec();
      return vehicle ? [vehicle] : [];
    }

    return this.vehicleModel
      .find({ status: { $ne: VehicleStatus.RETIRED } })
      .exec();
  }

  // Small helper so every call site sums one field from one model without
  // repeating the aggregate/group boilerplate — and stays fully typed.
  private async sumField(
    model: Model<FuelLogDocument> | Model<MaintenanceLogDocument>,
    match: Record<string, unknown>,
    field: string,
  ): Promise<number> {
    const [result] = await model
      .aggregate<SumResult>([
        { $match: match },
        { $group: { _id: null, total: { $sum: `$${field}` } } },
      ])
      .exec();

    return result?.total ?? 0;
  }

  async fuelEfficiency(query: Record<string, unknown>) {
    const vehicles = await this.getTargetVehicles(query);
    const range = this.buildDateRange(query);

    const items = await Promise.all(
      vehicles.map(async (vehicle) => {
        const vehicleId = new Types.ObjectId(String(vehicle._id));
        const fuelMatch: Record<string, unknown> = { vehicle: vehicleId };
        const tripMatch: Record<string, unknown> = { vehicle: vehicleId };

        if (range) {
          fuelMatch.date = range;
          tripMatch.createdAt = range;
        }

        const [fuelTotals, tripTotals] = await Promise.all([
          this.fuelLogModel
            .aggregate<FuelLitersResult>([
              { $match: fuelMatch },
              { $group: { _id: null, liters: { $sum: '$liters' } } },
            ])
            .exec(),
          this.tripModel
            .aggregate<TripDistanceResult>([
              { $match: { ...tripMatch, status: TripStatus.COMPLETED } },
              {
                $group: { _id: null, distance: { $sum: '$plannedDistanceKm' } },
              },
            ])
            .exec(),
        ]);

        const liters = fuelTotals[0]?.liters ?? 0;
        const distance = tripTotals[0]?.distance ?? 0;

        return {
          vehicleId: String(vehicle._id),
          registrationNumber: vehicle.registrationNumber,
          distance,
          fuelLiters: liters,
          efficiency: liters > 0 ? distance / liters : 0,
        };
      }),
    );

    return { items };
  }

  async fleetUtilization(query: Record<string, unknown>) {
    const range = this.buildDateRange(query);
    const [totalVehicles, activeTrips] = await Promise.all([
      this.vehicleModel
        .countDocuments({ status: { $ne: VehicleStatus.RETIRED } })
        .exec(),
      this.tripModel
        .countDocuments({
          status: TripStatus.DISPATCHED,
          ...(range ? { createdAt: range } : {}),
        })
        .exec(),
    ]);

    return {
      totalVehicles,
      activeTrips,
      utilization: totalVehicles > 0 ? (activeTrips / totalVehicles) * 100 : 0,
    };
  }

  async operationalCost(query: Record<string, unknown>) {
    const vehicles = await this.getTargetVehicles(query);
    const items = await Promise.all(
      vehicles.map(async (vehicle) => {
        const vehicleId = new Types.ObjectId(String(vehicle._id));
        const [fuelCost, maintenanceCost] = await Promise.all([
          this.sumField(this.fuelLogModel, { vehicle: vehicleId }, 'cost'),
          this.sumField(
            this.maintenanceLogModel,
            { vehicle: vehicleId },
            'cost',
          ),
        ]);

        return {
          vehicleId: String(vehicle._id),
          registrationNumber: vehicle.registrationNumber,
          fuelCost,
          maintenanceCost,
          total: fuelCost + maintenanceCost,
        };
      }),
    );

    return { items };
  }

  async vehicleRoi(query: Record<string, unknown>) {
    const vehicles = await this.getTargetVehicles(query);
    const items = await Promise.all(
      vehicles.map(async (vehicle) => {
        const vehicleId = new Types.ObjectId(String(vehicle._id));

        const [revenueTotals, fuelCost, maintenanceCost] = await Promise.all([
          this.tripModel
            .aggregate<TripRevenueResult>([
              { $match: { vehicle: vehicleId, status: TripStatus.COMPLETED } },
              {
                $group: {
                  _id: null,
                  revenue: { $sum: { $ifNull: ['$revenue', 0] } },
                },
              },
            ])
            .exec(),
          this.sumField(this.fuelLogModel, { vehicle: vehicleId }, 'cost'),
          this.sumField(
            this.maintenanceLogModel,
            { vehicle: vehicleId },
            'cost',
          ),
        ]);

        const revenue = revenueTotals[0]?.revenue ?? 0;
        const totalCost = fuelCost + maintenanceCost;
        const acquisitionCost = vehicle.acquisitionCost ?? 0;
        const roi =
          acquisitionCost > 0 ? (revenue - totalCost) / acquisitionCost : 0;

        return {
          vehicleId: String(vehicle._id),
          registrationNumber: vehicle.registrationNumber,
          revenue,
          totalCost,
          acquisitionCost,
          roi,
        };
      }),
    );

    return { items };
  }
}
