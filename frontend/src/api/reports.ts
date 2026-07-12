import { apiRequest, QueryParams } from './axios';

export interface FuelEfficiencyReportRow {
  vehicleId: string;
  registrationNumber: string;
  distance: number;
  fuelLiters: number;
  efficiency: number;
}

export interface FleetUtilizationReport {
  totalVehicles: number;
  activeTrips: number;
  utilization: number;
}

export interface OperationalCostReportRow {
  vehicleId: string;
  registrationNumber: string;
  fuelCost: number;
  maintenanceCost: number;
  total: number;
}

export interface VehicleRoiReportRow {
  vehicleId: string;
  registrationNumber: string;
  revenue: number;
  totalCost: number;
  acquisitionCost: number;
  roi: number;
}

export function getFuelEfficiencyReport(query: QueryParams = {}) {
  return apiRequest<{ items: FuelEfficiencyReportRow[] }>('/reports/fuel-efficiency', {
    query,
  });
}

export function getFleetUtilizationReport(query: QueryParams = {}) {
  return apiRequest<FleetUtilizationReport>('/reports/fleet-utilization', {
    query,
  });
}

export function getOperationalCostReport(query: QueryParams = {}) {
  return apiRequest<{ items: OperationalCostReportRow[] }>('/reports/operational-cost', {
    query,
  });
}

export function getVehicleRoiReport(query: QueryParams = {}) {
  return apiRequest<{ items: VehicleRoiReportRow[] }>('/reports/vehicle-roi', {
    query,
  });
}

export function exportReportCsv(report: string, query: QueryParams = {}) {
  return apiRequest<string>('/reports/export.csv', {
    query: { ...query, report },
    responseType: 'text',
  });
}

export function exportReportPdf(report: string, query: QueryParams = {}) {
  return apiRequest<Blob>('/reports/export.pdf', {
    query: { ...query, report },
    responseType: 'blob',
  });
}
