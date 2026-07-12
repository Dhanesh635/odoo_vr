import { Module } from '@nestjs/common';
import { AuthModule } from '../../common/auth/auth.module';
import { SchemasModule } from '../../schemas/schema.module';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, SchemasModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
