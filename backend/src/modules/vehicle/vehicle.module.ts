import { Module } from '@nestjs/common';
import { SchemasModule } from '../../schemas/schema.module';

import { VehicleController } from './vehicle.controller';
import { VehicleRepository } from './vehicle.repository';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [SchemasModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleRepository],
  exports: [VehicleService, VehicleRepository],
})
export class VehicleModule {}