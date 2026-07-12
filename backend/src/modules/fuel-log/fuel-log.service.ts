import { Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import { parsePagination, toObjectId } from '../shared/request.utils';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { FuelLogRepository } from './fuel-log.repository';

@Injectable()
export class FuelLogService {
	constructor(
		private readonly fuelLogRepository: FuelLogRepository,
		private readonly vehicleRepository: VehicleRepository,
	) {}

	private readonly createSchema = z.object({
		vehicle: z.string().min(1),
		trip: z.string().optional(),
		liters: z.coerce.number().nonnegative(),
		cost: z.coerce.number().nonnegative(),
		date: z.coerce.date().optional(),
	});

	async create(input: unknown) {
		const data = this.createSchema.parse(input);
		const vehicle = await this.vehicleRepository.findById(data.vehicle);

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		return this.fuelLogRepository.create({
			...data,
			vehicle: toObjectId(data.vehicle),
			trip: data.trip ? toObjectId(data.trip, 'trip') : undefined,
		});
	}

	async findAll(query: Record<string, unknown>) {
		const { skip, limit } = parsePagination(query);
		const filter: Record<string, unknown> = {};

		if (typeof query.vehicle === 'string') {
			filter.vehicle = query.vehicle;
		}

		if (typeof query.from === 'string' || typeof query.to === 'string') {
			filter.date = {};
			if (typeof query.from === 'string') {
				(filter.date as { $gte?: Date }).$gte = new Date(query.from);
			}
			if (typeof query.to === 'string') {
				(filter.date as { $lte?: Date }).$lte = new Date(query.to);
			}
		}

		const [items, total] = await Promise.all([
			this.fuelLogRepository.findMany(filter, skip, limit),
			this.fuelLogRepository.count(filter),
		]);

		return { items, page: Math.floor(skip / limit) + 1, limit, total };
	}
}