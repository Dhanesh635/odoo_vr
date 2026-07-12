import { Module } from '@nestjs/common';
import { VehicleModule } from '../vehicle/vehicle.module';
import { SchemasModule } from '../../schemas/schema.module';

import { FuelLogController } from './fuel-log.controller';
import { FuelLogRepository } from './fuel-log.repository';
import { FuelLogService } from './fuel-log.service';

@Module({
  imports: [SchemasModule, VehicleModule],
  controllers: [FuelLogController],
  providers: [FuelLogService, FuelLogRepository],
  exports: [FuelLogService],
})
export class FuelLogModule {}