import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver, DriverDocument } from '../../schemas/driver.schema';
import { Trip, TripDocument } from '../../schemas/trip.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { DriverStatus, TripStatus, VehicleStatus } from '../../schemas';

@Injectable()
export class DashboardRepository {
	constructor(
		@InjectModel(Vehicle.name)
		private readonly vehicleModel: Model<VehicleDocument>,
		@InjectModel(Trip.name)
		private readonly tripModel: Model<TripDocument>,
		@InjectModel(Driver.name)
		private readonly driverModel: Model<DriverDocument>,
	) {}

	async getKpis(query: Record<string, unknown>) {
		const vehicleFilter: Record<string, unknown> = {
			status: { $ne: VehicleStatus.RETIRED },
		};

		if (typeof query.type === 'string') {
			vehicleFilter.type = query.type;
		}

		if (typeof query.region === 'string') {
			vehicleFilter.region = query.region;
		}

		if (typeof query.status === 'string') {
			vehicleFilter.status = query.status;
		}

		const [activeVehicles, availableVehicles, inMaintenance, activeTrips, pendingTrips, driversOnDuty] =
			await Promise.all([
				this.vehicleModel.countDocuments(vehicleFilter).exec(),
				this.vehicleModel
					.countDocuments({ ...vehicleFilter, status: VehicleStatus.AVAILABLE })
					.exec(),
				this.vehicleModel
					.countDocuments({ ...vehicleFilter, status: VehicleStatus.IN_SHOP })
					.exec(),
				this.tripModel.countDocuments({ status: TripStatus.DISPATCHED }).exec(),
				this.tripModel.countDocuments({ status: TripStatus.DRAFT }).exec(),
				this.driverModel.countDocuments({ status: DriverStatus.ON_TRIP }).exec(),
			]);

		const fleetUtilization = activeVehicles > 0 ? (activeTrips / activeVehicles) * 100 : 0;

		return {
			activeVehicles,
			availableVehicles,
			inMaintenance,
			activeTrips,
			pendingTrips,
			driversOnDuty,
			fleetUtilization,
		};
	}
}
