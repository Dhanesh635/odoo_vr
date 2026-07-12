import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { z } from 'zod';
import { MaintenanceStatus, VehicleStatus } from '../../schemas';
import { parsePagination, toObjectId } from '../shared/request.utils';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { MaintenanceLogRepository } from './maintenance-log.repository';

@Injectable()
export class MaintenanceLogService {
  constructor(
    private readonly maintenanceLogRepository: MaintenanceLogRepository,
    private readonly vehicleRepository: VehicleRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private readonly createSchema = z.object({
    vehicle: z.string().min(1),
    serviceType: z.string().trim().min(1),
    description: z.string().trim().optional(),
    cost: z.coerce.number().nonnegative(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  });

  private readonly updateSchema = this.createSchema.partial();

  async create(input: unknown) {
    const data = this.createSchema.parse(input);
    const vehicle = await this.vehicleRepository.findById(data.vehicle);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const session = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        await this.vehicleRepository.findByIdAndUpdate(
          data.vehicle,
          { status: VehicleStatus.IN_SHOP },
          session,
        );

        return this.maintenanceLogRepository.create(
          {
            ...data,
            vehicle: toObjectId(data.vehicle),
            status: MaintenanceStatus.ACTIVE,
          },
          session,
        );
      });
    } finally {
      await session.endSession();
    }
  }

  async findAll(query: Record<string, unknown>) {
    const { skip, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};

    if (typeof query.vehicle === 'string') {
      filter.vehicle = query.vehicle;
    }

    if (typeof query.status === 'string') {
      filter.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.maintenanceLogRepository.findMany(filter, skip, limit),
      this.maintenanceLogRepository.count(filter),
    ]);

    return { items, page: Math.floor(skip / limit) + 1, limit, total };
  }

  async findOne(id: string) {
    const record = await this.maintenanceLogRepository.findById(id);

    if (!record) {
      throw new NotFoundException('Maintenance record not found');
    }

    return record;
  }

  async update(id: string, input: unknown) {
    const data = this.updateSchema.parse(input);
    const update: Record<string, unknown> = { ...data };

    if (typeof data.vehicle === 'string') {
      update.vehicle = toObjectId(data.vehicle);
    }

    const record = await this.maintenanceLogRepository.findByIdAndUpdate(
      id,
      update as Partial<unknown>,
    );

    if (!record) {
      throw new NotFoundException('Maintenance record not found');
    }

    return record;
  }

  async close(id: string) {
    const session = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        const record = await this.maintenanceLogRepository.findById(id);

        if (!record) {
          throw new NotFoundException('Maintenance record not found');
        }

        if (record.status === MaintenanceStatus.CLOSED) {
          throw new BadRequestException('Maintenance record is already closed');
        }

        const vehicle = await this.vehicleRepository.findById(String(record.vehicle));

        if (!vehicle) {
          throw new NotFoundException('Vehicle not found');
        }

        if (vehicle.status !== VehicleStatus.RETIRED) {
          await this.vehicleRepository.findByIdAndUpdate(
            String(record.vehicle),
            { status: VehicleStatus.AVAILABLE },
            session,
          );
        }

        return this.maintenanceLogRepository.findByIdAndUpdate(
          id,
          {
            status: MaintenanceStatus.CLOSED,
            endDate: record.endDate ?? new Date(),
          },
          session,
        );
      });
    } finally {
      await session.endSession();
    }
  }
}