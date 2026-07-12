import { Module } from '@nestjs/common';
import { DriverModule } from '../driver/driver.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { SchemasModule } from '../../schemas/schema.module';

import { TripController } from './trip.controller';
import { TripRepository } from './trip.repository';
import { TripService } from './trip.service';

@Module({
  imports: [SchemasModule, VehicleModule, DriverModule],
  controllers: [TripController],
  providers: [TripService, TripRepository],
  exports: [TripService],
})
export class TripModule {}