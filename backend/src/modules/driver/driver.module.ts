import { Module } from '@nestjs/common';
import { SchemasModule } from '../../schemas/schema.module';

import { DriverController } from './driver.controller';
import { DriverRepository } from './driver.repository';
import { DriverService } from './driver.service';

@Module({
  imports: [SchemasModule],
  controllers: [DriverController],
  providers: [DriverService, DriverRepository],
  exports: [DriverService, DriverRepository],
})
export class DriverModule {}
