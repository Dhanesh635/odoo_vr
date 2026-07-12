import { apiRequest, QueryParams } from './axios';

export interface MaintenanceRecord {
	_id: string;
	vehicle: string;
	serviceType: string;
	description?: string;
	cost: number;
	startDate?: string;
	endDate?: string;
	status: string;
}

export interface MaintenanceListResponse {
	items: MaintenanceRecord[];
	page: number;
	limit: number;
	total: number;
}

export function createMaintenance(payload: Partial<MaintenanceRecord>) {
	return apiRequest<MaintenanceRecord>('/maintenance', {
		method: 'POST',
		body: payload,
	});
}

export function listMaintenance(query: QueryParams = {}) {
	return apiRequest<MaintenanceListResponse>('/maintenance', { query });
}

export function getMaintenance(id: string) {
	return apiRequest<MaintenanceRecord>(`/maintenance/${id}`);
}

export function updateMaintenance(id: string, payload: Partial<MaintenanceRecord>) {
	return apiRequest<MaintenanceRecord>(`/maintenance/${id}`, {
		method: 'PATCH',
		body: payload,
	});
}

export function closeMaintenance(id: string) {
	return apiRequest<MaintenanceRecord>(`/maintenance/${id}/close`, {
		method: 'POST',
	});
}

