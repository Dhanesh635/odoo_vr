import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Vehicle, VehicleSchema } from './vehicle.schema';
import { Driver, DriverSchema } from './driver.schema';
import { Trip, TripSchema } from './trip.schema';
import { MaintenanceLog, MaintenanceLogSchema } from './maintenance-log.schema';
import { FuelLog, FuelLogSchema } from './fuel-log.schema';
import { Expense, ExpenseSchema } from './expense.schema';

// Import this module wherever you need model injection
// (e.g. `@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>`).
// Keeping all forFeature() registrations in one place avoids re-declaring

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Trip.name, schema: TripSchema },
      { name: MaintenanceLog.name, schema: MaintenanceLogSchema },
      { name: FuelLog.name, schema: FuelLogSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemasModule {}
