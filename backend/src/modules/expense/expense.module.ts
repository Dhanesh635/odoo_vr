import { Module } from '@nestjs/common';
import { VehicleModule } from '../vehicle/vehicle.module';
import { SchemasModule } from '../../schemas/schema.module';

import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';
import { ExpenseService } from './expense.service';

@Module({
  imports: [SchemasModule, VehicleModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository],
  exports: [ExpenseService],
})
export class ExpenseModule {}