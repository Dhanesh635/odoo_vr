import { apiRequest, QueryParams } from './axios';

export interface Trip {
	_id: string;
	source: string;
	destination: string;
	vehicle: string;
	driver: string;
	cargoWeightKg: number;
	plannedDistanceKm: number;
	finalOdometerKm?: number;
	fuelConsumedLiters?: number;
	revenue?: number;
	status: string;
	dispatchedAt?: string;
	completedAt?: string;
	cancelledAt?: string;
}

export interface TripListResponse {
	items: Trip[];
	page: number;
	limit: number;
	total: number;
}

export function createTrip(payload: Partial<Trip>) {
	return apiRequest<Trip>('/trips', {
		method: 'POST',
		body: payload,
	});
}

export function listTrips(query: QueryParams = {}) {
	return apiRequest<TripListResponse>('/trips', { query });
}

export function getTrip(id: string) {
	return apiRequest<Trip>(`/trips/${id}`);
}

export function updateTrip(id: string, payload: Partial<Trip>) {
	return apiRequest<Trip>(`/trips/${id}`, {
		method: 'PATCH',
		body: payload,
	});
}

export function dispatchTrip(id: string) {
	return apiRequest<Trip>(`/trips/${id}/dispatch`, { method: 'POST' });
}

export function completeTrip(
	id: string,
	payload: { finalOdometerKm: number; fuelConsumedLiters: number },
) {
	return apiRequest<Trip>(`/trips/${id}/complete`, {
		method: 'POST',
		body: payload,
	});
}

export function cancelTrip(id: string) {
	return apiRequest<Trip>(`/trips/${id}/cancel`, { method: 'POST' });
}

export function deleteTrip(id: string) {
	return apiRequest<Trip>(`/trips/${id}`, { method: 'DELETE' });
}

