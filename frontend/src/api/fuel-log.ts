import { apiRequest, QueryParams } from './axios';

export interface FuelLog {
  _id: string;
  vehicle: string;
  trip?: string;
  liters: number;
  cost: number;
  odometerKm?: number;
  fuelType?: string;
  loggedAt?: string;
}

export interface FuelLogListResponse {
  items: FuelLog[];
  page: number;
  limit: number;
  total: number;
}

export function createFuelLog(payload: Partial<FuelLog>) {
  return apiRequest<FuelLog>('/fuel-logs', {
    method: 'POST',
    body: payload,
  });
}

export function listFuelLogs(query: QueryParams = {}) {
  return apiRequest<FuelLogListResponse>('/fuel-logs', { query });
}
