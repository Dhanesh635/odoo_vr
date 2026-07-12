import { apiRequest, QueryParams } from './axios';

export interface DashboardKpis {
	activeVehicles: number;
	availableVehicles: number;
	inMaintenance: number;
	activeTrips: number;
	pendingTrips: number;
	driversOnDuty: number;
	fleetUtilization: number;
}

export function getDashboardKpis(query: QueryParams = {}) {
	return apiRequest<DashboardKpis>('/dashboard/kpis', {
		query,
	});
}

