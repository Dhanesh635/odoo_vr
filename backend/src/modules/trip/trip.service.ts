import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { z } from 'zod';
import { DriverStatus, TripStatus, VehicleStatus } from '../../schemas';
import { DriverRepository } from '../driver/driver.repository';
import { parsePagination, toObjectId } from '../shared/request.utils';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { TripRepository } from './trip.repository';

@Injectable()
export class TripService {
	constructor(
		private readonly tripRepository: TripRepository,
		private readonly vehicleRepository: VehicleRepository,
		private readonly driverRepository: DriverRepository,
		@InjectConnection() private readonly connection: Connection,
	) {}

	private readonly createSchema = z.object({
		source: z.string().trim().min(1),
		destination: z.string().trim().min(1),
		vehicle: z.string().min(1),
		driver: z.string().min(1),
		cargoWeightKg: z.coerce.number().nonnegative(),
		plannedDistanceKm: z.coerce.number().nonnegative(),
		revenue: z.coerce.number().nonnegative().optional(),
	});

	private readonly updateSchema = this.createSchema.partial();

	async create(input: unknown) {
		const data = this.createSchema.parse(input);
		const vehicle = await this.vehicleRepository.findById(data.vehicle);
		const driver = await this.driverRepository.findById(data.driver);

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		if (!driver) {
			throw new NotFoundException('Driver not found');
		}

		if (data.cargoWeightKg > vehicle.maxLoadCapacityKg) {
			throw new BadRequestException('Cargo weight exceeds vehicle capacity');
		}

		return this.tripRepository.create({
			...data,
			vehicle: toObjectId(data.vehicle),
			driver: toObjectId(data.driver),
			status: TripStatus.DRAFT,
		});
	}

	async findAll(query: Record<string, unknown>) {
		const { skip, limit } = parsePagination(query);
		const filter: Record<string, unknown> = {};

		if (typeof query.status === 'string') {
			filter.status = query.status;
		}

		const [items, total] = await Promise.all([
			this.tripRepository.findMany(filter, skip, limit),
			this.tripRepository.count(filter),
		]);

		return { items, page: Math.floor(skip / limit) + 1, limit, total };
	}

	async findOne(id: string) {
		const trip = await this.tripRepository.findById(id);

		if (!trip) {
			throw new NotFoundException('Trip not found');
		}

		return trip;
	}

	async update(id: string, input: unknown) {
		const trip = await this.tripRepository.findById(id);

		if (!trip) {
			throw new NotFoundException('Trip not found');
		}

		if (trip.status !== TripStatus.DRAFT) {
			throw new BadRequestException('Only draft trips can be edited');
		}

		const data = this.updateSchema.parse(input);
		const nextVehicleId = data.vehicle ?? String(trip.vehicle);
		const nextDriverId = data.driver ?? String(trip.driver);
		const vehicle = await this.vehicleRepository.findById(nextVehicleId);
		const driver = await this.driverRepository.findById(nextDriverId);

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		if (!driver) {
			throw new NotFoundException('Driver not found');
		}

		const nextCargoWeight = data.cargoWeightKg ?? trip.cargoWeightKg;

		if (nextCargoWeight > vehicle.maxLoadCapacityKg) {
			throw new BadRequestException('Cargo weight exceeds vehicle capacity');
		}

		return this.tripRepository.findByIdAndUpdate(id, {
			...data,
			vehicle: data.vehicle ? toObjectId(data.vehicle) : trip.vehicle,
			driver: data.driver ? toObjectId(data.driver) : trip.driver,
		});
	}

	async dispatch(id: string) {
		const session = await this.connection.startSession();

		try {
			return await session.withTransaction(async () => {
				const trip = await this.tripRepository.findById(id);

				if (!trip) {
					throw new NotFoundException('Trip not found');
				}

				if (trip.status !== TripStatus.DRAFT) {
					throw new BadRequestException('Only draft trips can be dispatched');
				}

				const vehicle = await this.vehicleRepository.findById(String(trip.vehicle));
				const driver = await this.driverRepository.findById(String(trip.driver));

				if (!vehicle || vehicle.status !== VehicleStatus.AVAILABLE) {
					throw new BadRequestException('Vehicle is not available');
				}

				if (!driver || driver.status !== DriverStatus.AVAILABLE) {
					throw new BadRequestException('Driver is not available');
				}

				if (new Date(driver.licenseExpiryDate) <= new Date()) {
					throw new BadRequestException('Driver license has expired');
				}

				await this.vehicleRepository.findByIdAndUpdate(
					String(trip.vehicle),
					{ status: VehicleStatus.ON_TRIP },
					session,
				);
				await this.driverRepository.findByIdAndUpdate(
					String(trip.driver),
					{ status: DriverStatus.ON_TRIP },
					session,
				);

				return this.tripRepository.findByIdAndUpdate(
					id,
					{ status: TripStatus.DISPATCHED, dispatchedAt: new Date() },
					session,
				);
			});
		} finally {
			await session.endSession();
		}
	}

	async complete(id: string, input: unknown) {
		const bodySchema = z.object({
			finalOdometerKm: z.coerce.number().nonnegative(),
			fuelConsumedLiters: z.coerce.number().nonnegative(),
		});
		const data = bodySchema.parse(input);
		const session = await this.connection.startSession();

		try {
			return await session.withTransaction(async () => {
				const trip = await this.tripRepository.findById(id);

				if (!trip) {
					throw new NotFoundException('Trip not found');
				}

				if (trip.status !== TripStatus.DISPATCHED) {
					throw new BadRequestException('Only dispatched trips can be completed');
				}

				await this.vehicleRepository.findByIdAndUpdate(
					String(trip.vehicle),
					{ status: VehicleStatus.AVAILABLE },
					session,
				);
				await this.driverRepository.findByIdAndUpdate(
					String(trip.driver),
					{ status: DriverStatus.AVAILABLE },
					session,
				);

				return this.tripRepository.findByIdAndUpdate(
					id,
					{
						...data,
						status: TripStatus.COMPLETED,
						completedAt: new Date(),
					},
					session,
				);
			});
		} finally {
			await session.endSession();
		}
	}

	async cancel(id: string) {
		const session = await this.connection.startSession();

		try {
			return await session.withTransaction(async () => {
				const trip = await this.tripRepository.findById(id);

				if (!trip) {
					throw new NotFoundException('Trip not found');
				}

				if (trip.status !== TripStatus.DISPATCHED) {
					throw new BadRequestException('Only dispatched trips can be cancelled');
				}

				await this.vehicleRepository.findByIdAndUpdate(
					String(trip.vehicle),
					{ status: VehicleStatus.AVAILABLE },
					session,
				);
				await this.driverRepository.findByIdAndUpdate(
					String(trip.driver),
					{ status: DriverStatus.AVAILABLE },
					session,
				);

				return this.tripRepository.findByIdAndUpdate(
					id,
					{ status: TripStatus.CANCELLED, cancelledAt: new Date() },
					session,
				);
			});
		} finally {
			await session.endSession();
		}
	}

	async remove(id: string) {
		const trip = await this.tripRepository.findById(id);

		if (!trip) {
			throw new NotFoundException('Trip not found');
		}

		if (trip.status !== TripStatus.DRAFT) {
			throw new BadRequestException('Only draft trips can be deleted');
		}

		return this.tripRepository.deleteById(id);
	}
}