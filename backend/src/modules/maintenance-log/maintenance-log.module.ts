import { Module } from '@nestjs/common';
import { VehicleModule } from '../vehicle/vehicle.module';
import { SchemasModule } from '../../schemas/schema.module';

import { MaintenanceLogController } from './maintenance-log.controller';
import { MaintenanceLogRepository } from './maintenance-log.repository';
import { MaintenanceLogService } from './maintenance-log.service';

@Module({
  imports: [SchemasModule, VehicleModule],
  controllers: [MaintenanceLogController],
  providers: [MaintenanceLogService, MaintenanceLogRepository],
  exports: [MaintenanceLogService],
})
export class MaintenanceLogModule {}