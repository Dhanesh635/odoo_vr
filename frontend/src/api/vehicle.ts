import { apiRequest, QueryParams } from './axios';

export interface Vehicle {
	_id: string;
	registrationNumber: string;
	name: string;
	type: string;
	maxLoadCapacityKg: number;
	odometerKm: number;
	acquisitionCost: number;
	status: string;
	region?: string;
}

export interface VehicleListResponse {
	items: Vehicle[];
	page: number;
	limit: number;
	total: number;
}

export function createVehicle(payload: Partial<Vehicle>) {
	return apiRequest<Vehicle>('/vehicles', {
		method: 'POST',
		body: payload,
	});
}

export function listVehicles(query: QueryParams = {}) {
	return apiRequest<VehicleListResponse>('/vehicles', { query });
}

export function getVehicle(id: string) {
	return apiRequest<Vehicle>(`/vehicles/${id}`);
}

export function updateVehicle(id: string, payload: Partial<Vehicle>) {
	return apiRequest<Vehicle>(`/vehicles/${id}`, {
		method: 'PATCH',
		body: payload,
	});
}

export function deleteVehicle(id: string) {
	return apiRequest<Vehicle>(`/vehicles/${id}`, {
		method: 'DELETE',
	});
}

export function listAvailableVehicles(query: QueryParams = {}) {
	return apiRequest<VehicleListResponse>('/vehicles/available', { query });
}

export function getVehicleOperationalCost(id: string) {
	return apiRequest<{ vehicleId: string; fuelCost: number; maintenanceCost: number; total: number }>(
		`/vehicles/${id}/operational-cost`,
	);
}

