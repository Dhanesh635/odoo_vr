import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
	constructor(private readonly dashboardRepository: DashboardRepository) {}

	getKpis(query: Record<string, unknown>) {
		return this.dashboardRepository.getKpis(query);
	}
}
