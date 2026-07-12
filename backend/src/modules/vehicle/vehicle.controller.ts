import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../schemas';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(UserRole.FLEET_MANAGER)
  @Post()
  create(@Body() body: unknown) {
    return this.vehicleService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.vehicleService.findAll(query);
  }

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER)
  @Get('available')
  findAvailable(@Query() query: Record<string, unknown>) {
    return this.vehicleService.findAvailable(query);
  }

  @Get(':id/operational-cost')
  operationalCost(@Param('id') id: string) {
    return this.vehicleService.operationalCost(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Roles(UserRole.FLEET_MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.vehicleService.update(id, body);
  }

  @Roles(UserRole.FLEET_MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}