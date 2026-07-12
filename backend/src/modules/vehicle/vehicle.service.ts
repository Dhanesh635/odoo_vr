import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleStatus } from '../../schemas';
import { z } from 'zod';
import { parsePagination, toObjectId } from '../shared/request.utils';
import { VehicleRepository } from './vehicle.repository';

@Injectable()
export class VehicleService {
	constructor(private readonly vehicleRepository: VehicleRepository) {}

	private readonly createSchema = z.object({
		registrationNumber: z.string().trim().min(1),
		name: z.string().trim().min(1),
		type: z.string().trim().min(1),
		maxLoadCapacityKg: z.coerce.number().nonnegative(),
		odometerKm: z.coerce.number().nonnegative().default(0),
		acquisitionCost: z.coerce.number().nonnegative(),
		status: z.nativeEnum(VehicleStatus).optional(),
		region: z.string().trim().optional(),
	});

	private readonly updateSchema = this.createSchema.partial();

	async create(input: unknown) {
		const data = this.createSchema.parse(input);
		return this.vehicleRepository.create({
			...data,
			registrationNumber: data.registrationNumber.toUpperCase(),
		});
	}

	async findAll(query: Record<string, unknown>) {
		const { skip, limit } = parsePagination(query);
		const filter: Record<string, unknown> = {};

		if (typeof query.status === 'string') {
			filter.status = query.status;
		}

		if (typeof query.type === 'string') {
			filter.type = query.type;
		}

		if (typeof query.region === 'string') {
			filter.region = query.region;
		}

		const [items, total] = await Promise.all([
			this.vehicleRepository.findMany(filter, skip, limit),
			this.vehicleRepository.count(filter),
		]);

		return { items, page: Math.floor(skip / limit) + 1, limit, total };
	}

	async findOne(id: string) {
		const vehicle = await this.vehicleRepository.findById(id);

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		return vehicle;
	}

	async update(id: string, input: unknown) {
		const data = this.updateSchema.parse(input);
		const vehicle = await this.vehicleRepository.findByIdAndUpdate(id, {
			...data,
			registrationNumber: data.registrationNumber?.toUpperCase(),
		});

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		return vehicle;
	}

	async remove(id: string) {
		const vehicle = await this.vehicleRepository.softDelete(id);

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		return vehicle;
	}

	async findAvailable(query: Record<string, unknown>) {
		const { skip, limit } = parsePagination(query);
		const filter: Record<string, unknown> = {};

		if (typeof query.type === 'string') {
			filter.type = query.type;
		}

		if (typeof query.region === 'string') {
			filter.region = query.region;
		}

		const [items, total] = await Promise.all([
			this.vehicleRepository.findAvailable(filter, skip, limit),
			this.vehicleRepository.count({ ...filter, status: VehicleStatus.AVAILABLE }),
		]);

		return { items, page: Math.floor(skip / limit) + 1, limit, total };
	}

	async operationalCost(id: string) {
		const vehicle = await this.vehicleRepository.findById(id);

		if (!vehicle) {
			throw new NotFoundException('Vehicle not found');
		}

		const costs = await this.vehicleRepository.getOperationalCost(id);

		return {
			vehicleId: toObjectId(id),
			...costs,
			total: costs.fuelCost + costs.maintenanceCost,
		};
	}
}
