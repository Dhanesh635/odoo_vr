import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { SchemasModule } from './schemas/schema.module';
import { AuthModule } from './common/auth/auth.module';
import { ExpenseModule } from './modules/expense';
import { FuelLogModule } from './modules/fuel-log';
import { MaintenanceLogModule } from './modules/maintenance-log';
import { TripModule } from './modules/trip';
import { DriverModule } from './modules/driver';
import { VehicleModule } from './modules/vehicle';
import { UsersModule } from './modules/users';
import { DashboardModule } from './modules/dashboard';
import { ReportsModule } from './modules/reports';

import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { RolesGuard } from './common/auth/roles.guard';
import { TokenService } from './common/auth/token.service';
import { validate } from './config/validate.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    AuthModule,
    SchemasModule,
    UsersModule,
    VehicleModule,
    DriverModule,
    TripModule,
    MaintenanceLogModule,
    FuelLogModule,
    ExpenseModule,
    DashboardModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
