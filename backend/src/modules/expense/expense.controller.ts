import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../schemas';
import { ExpenseService } from './expense.service';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Roles(UserRole.DRIVER, UserRole.FLEET_MANAGER, UserRole.FINANCIAL_ANALYST)
  @Post()
  create(@Body() body: unknown) {
    return this.expenseService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.expenseService.findAll(query);
  }
}