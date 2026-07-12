import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../schemas';
import { FuelLogService } from './fuel-log.service';

@Controller('fuel-logs')
export class FuelLogController {
  constructor(private readonly fuelLogService: FuelLogService) {}

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER)
  @Post()
  create(@Body() body: unknown) {
    return this.fuelLogService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.fuelLogService.findAll(query);
  }
}