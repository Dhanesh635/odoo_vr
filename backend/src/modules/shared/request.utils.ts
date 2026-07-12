import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { z } from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export function parsePagination(query: Record<string, unknown>) {
  const parsed = paginationSchema.parse(query);

  return {
    page: parsed.page,
    limit: parsed.limit,
    skip: (parsed.page - 1) * parsed.limit,
  };
}

export function toObjectId(value: string, label = 'id') {
  if (!Types.ObjectId.isValid(value)) {
    throw new BadRequestException(`Invalid ${label}`);
  }

  return new Types.ObjectId(value);
}
