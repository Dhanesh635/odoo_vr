import { Injectable, NotFoundException } from '@nestjs/common';
import { toObjectId } from '../shared/request.utils';
import { DriverStatus } from '../../schemas';
import { z } from 'zod';
import { parsePagination } from '../shared/request.utils';
import { DriverRepository } from './driver.repository';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  private readonly createSchema = z.object({
    userId: z.string().optional(),
    name: z.string().trim().min(1),
    licenseNumber: z.string().trim().min(1),
    licenseCategory: z.string().trim().min(1),
    licenseExpiryDate: z.coerce.date(),
    contactNumber: z.string().trim().min(1),
    safetyScore: z.coerce.number().min(0).max(100).default(100),
    status: z.nativeEnum(DriverStatus).optional(),
  });

  private readonly updateSchema = this.createSchema.partial();

  async create(input: unknown) {
    const data = this.createSchema.parse(input);
    return this.driverRepository.create({
      ...data,
      userId: data.userId ? toObjectId(data.userId, 'userId') : undefined,
    });
  }

  async findAll(query: Record<string, unknown>) {
    const { skip, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};

    if (typeof query.status === 'string') {
      filter.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.driverRepository.findMany(filter, skip, limit),
      this.driverRepository.count(filter),
    ]);

    return { items, page: Math.floor(skip / limit) + 1, limit, total };
  }

  async findOne(id: string) {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async update(id: string, input: unknown) {
    const data = this.updateSchema.parse(input);
    const driver = await this.driverRepository.findByIdAndUpdate(id, {
      ...data,
      userId: data.userId ? toObjectId(data.userId, 'userId') : undefined,
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async remove(id: string) {
    const driver = await this.driverRepository.softDelete(id);

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async findAvailable(query: Record<string, unknown>) {
    const { skip, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};

    const [items, total] = await Promise.all([
      this.driverRepository.findAvailable(filter, skip, limit),
      this.driverRepository.count({
        ...filter,
        status: DriverStatus.AVAILABLE,
      }),
    ]);

    return { items, page: Math.floor(skip / limit) + 1, limit, total };
  }

  async expiringLicenses(query: Record<string, unknown>) {
    const withinDays = Number(query.withinDays ?? 30);
    return this.driverRepository.findExpiringWithin(
      Number.isNaN(withinDays) ? 30 : withinDays,
    );
  }
}
