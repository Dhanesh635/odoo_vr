import { Module } from '@nestjs/common';
import { SchemasModule } from '../../schemas/schema.module';

import { ReportsController } from './reports.controller';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

@Module({
  imports: [SchemasModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
  exports: [ReportsService],
})
export class ReportsModule {}
