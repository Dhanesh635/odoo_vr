import { apiRequest, QueryParams } from './axios';

export interface Driver {
	_id: string;
	userId?: string;
	name: string;
	licenseNumber: string;
	licenseCategory: string;
	licenseExpiryDate: string;
	contactNumber: string;
	safetyScore: number;
	status: string;
}

export interface DriverListResponse {
	items: Driver[];
	page: number;
	limit: number;
	total: number;
}

export function createDriver(payload: Partial<Driver>) {
	return apiRequest<Driver>('/drivers', {
		method: 'POST',
		body: payload,
	});
}

export function listDrivers(query: QueryParams = {}) {
	return apiRequest<DriverListResponse>('/drivers', { query });
}

export function getDriver(id: string) {
	return apiRequest<Driver>(`/drivers/${id}`);
}

export function updateDriver(id: string, payload: Partial<Driver>) {
	return apiRequest<Driver>(`/drivers/${id}`, {
		method: 'PATCH',
		body: payload,
	});
}

export function deleteDriver(id: string) {
	return apiRequest<Driver>(`/drivers/${id}`, {
		method: 'DELETE',
	});
}

export function listAvailableDrivers(query: QueryParams = {}) {
	return apiRequest<DriverListResponse>('/drivers/available', { query });
}

export function listExpiringLicenses(withinDays = 30) {
	return apiRequest<Driver[]>('/drivers/expiring-licenses', {
		query: { withinDays },
	});
}

