import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../schemas';
import { MaintenanceLogService } from './maintenance-log.service';

@Controller('maintenance')
export class MaintenanceLogController {
  constructor(private readonly maintenanceLogService: MaintenanceLogService) {}

  @Roles(UserRole.FLEET_MANAGER)
  @Post()
  create(@Body() body: unknown) {
    return this.maintenanceLogService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.maintenanceLogService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceLogService.findOne(id);
  }

  @Roles(UserRole.FLEET_MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.maintenanceLogService.update(id, body);
  }

  @Roles(UserRole.FLEET_MANAGER)
  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.maintenanceLogService.close(id);
  }
}