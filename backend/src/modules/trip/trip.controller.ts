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
import { TripService } from './trip.service';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Roles(UserRole.DRIVER)
  @Post()
  create(@Body() body: unknown) {
    return this.tripService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.tripService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Roles(UserRole.DRIVER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.tripService.update(id, body);
  }

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER)
  @Post(':id/dispatch')
  dispatch(@Param('id') id: string) {
    return this.tripService.dispatch(id);
  }

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER)
  @Post(':id/complete')
  complete(@Param('id') id: string, @Body() body: unknown) {
    return this.tripService.complete(id, body);
  }

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER)
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.tripService.cancel(id);
  }

  @Roles(UserRole.FLEET_MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(id);
  }
}