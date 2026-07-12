import { Controller, Get, Header, Query } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../schemas';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Roles(UserRole.FINANCIAL_ANALYST, UserRole.FLEET_MANAGER)
	@Get('fuel-efficiency')
	fuelEfficiency(@Query() query: Record<string, unknown>) {
		return this.reportsService.fuelEfficiency(query);
	}

	@Roles(UserRole.FINANCIAL_ANALYST, UserRole.FLEET_MANAGER)
	@Get('fleet-utilization')
	fleetUtilization(@Query() query: Record<string, unknown>) {
		return this.reportsService.fleetUtilization(query);
	}

	@Roles(UserRole.FINANCIAL_ANALYST)
	@Get('operational-cost')
	operationalCost(@Query() query: Record<string, unknown>) {
		return this.reportsService.operationalCost(query);
	}

	@Roles(UserRole.FINANCIAL_ANALYST)
	@Get('vehicle-roi')
	vehicleRoi(@Query() query: Record<string, unknown>) {
		return this.reportsService.vehicleRoi(query);
	}

	@Roles(UserRole.FINANCIAL_ANALYST, UserRole.FLEET_MANAGER)
	@Get('export.csv')
	@Header('Content-Type', 'text/csv')
	exportCsv(@Query() query: Record<string, unknown>) {
		return this.reportsService.exportCsv(query);
	}

	@Roles(UserRole.FINANCIAL_ANALYST, UserRole.FLEET_MANAGER)
	@Get('export.pdf')
	@Header('Content-Type', 'application/pdf')
	exportPdf(@Query() query: Record<string, unknown>) {
		return this.reportsService.exportPdf(query);
	}
}
