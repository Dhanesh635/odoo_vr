import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../schemas';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
	constructor(private readonly dashboardService: DashboardService) {}

	@Roles(
		UserRole.FLEET_MANAGER,
		UserRole.DRIVER,
		UserRole.SAFETY_OFFICER,
		UserRole.FINANCIAL_ANALYST,
	)
	@Get('kpis')
	getKpis(@Query() query: Record<string, unknown>) {
		return this.dashboardService.getKpis(query);
	}
}
