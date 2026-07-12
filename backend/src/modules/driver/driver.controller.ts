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
import { DriverService } from './driver.service';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Roles(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)
  @Post()
  create(@Body() body: unknown) {
    return this.driverService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.driverService.findAll(query);
  }

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER)
  @Get('available')
  findAvailable(@Query() query: Record<string, unknown>) {
    return this.driverService.findAvailable(query);
  }

  @Roles(UserRole.SAFETY_OFFICER)
  @Get('expiring-licenses')
  expiringLicenses(@Query() query: Record<string, unknown>) {
    return this.driverService.expiringLicenses(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Roles(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.driverService.update(id, body);
  }

  @Roles(UserRole.FLEET_MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }
}
