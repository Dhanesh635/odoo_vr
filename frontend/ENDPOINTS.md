# TransitOps Frontend API Endpoints

This document is the frontend-facing map of the backend REST API. It matches the client wrappers in `frontend/src/api/*` and assumes requests are sent to `NEXT_PUBLIC_API_URL`.

## Base Rules

- Base URL: `NEXT_PUBLIC_API_URL` or `http://localhost:3000` if not set.
- Auth: all routes except `/auth/login` and `/auth/register` require `Authorization: Bearer <token>`.
- Token storage: the frontend stores the JWT in `localStorage` under `transitops_auth_token`.
- Pagination: list endpoints support `?page=&limit=` and the relevant filters noted below.
- Role handling: the UI should gate actions using `/auth/me` plus the role returned in the user payload.

## Auth

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| POST | `/auth/register` | `register()` in `src/api/auth.ts` | Creates a user and stores the returned token |
| POST | `/auth/login` | `login()` in `src/api/auth.ts` | Email/password sign-in and token storage |
| GET | `/auth/me` | `getCurrentUser()` in `src/api/auth.ts` | Returns the current authenticated user |

## Dashboard

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| GET | `/dashboard/kpis` | `getDashboardKpis()` in `src/api/dashboard.ts` | KPI summary for the dashboard |
| GET | `/dashboard/kpis?type=&status=&region=` | `getDashboardKpis({ type, status, region })` | Filtered KPI view |

## Vehicles

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| POST | `/vehicles` | `createVehicle()` in `src/api/vehicle.ts` | Create a vehicle |
| GET | `/vehicles` | `listVehicles()` in `src/api/vehicle.ts` | Supports `status`, `type`, `region`, `page`, `limit` |
| GET | `/vehicles/:id` | `getVehicle(id)` in `src/api/vehicle.ts` | Vehicle detail view |
| PATCH | `/vehicles/:id` | `updateVehicle(id, payload)` in `src/api/vehicle.ts` | Edit vehicle master data |
| DELETE | `/vehicles/:id` | `deleteVehicle(id)` in `src/api/vehicle.ts` | Remove or soft-delete a vehicle |
| GET | `/vehicles/available` | `listAvailableVehicles()` in `src/api/vehicle.ts` | Dispatch pool for assignment |
| GET | `/vehicles/:id/operational-cost` | `getVehicleOperationalCost(id)` in `src/api/vehicle.ts` | Fuel + maintenance cost summary |

## Drivers

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| POST | `/drivers` | `createDriver()` in `src/api/driver.ts` | Create driver profile |
| GET | `/drivers` | `listDrivers()` in `src/api/driver.ts` | Supports `status`, `page`, `limit` |
| GET | `/drivers/:id` | `getDriver(id)` in `src/api/driver.ts` | Driver detail view |
| PATCH | `/drivers/:id` | `updateDriver(id, payload)` in `src/api/driver.ts` | Edit profile, safety score, status |
| DELETE | `/drivers/:id` | `deleteDriver(id)` in `src/api/driver.ts` | Remove or soft-delete a driver |
| GET | `/drivers/available` | `listAvailableDrivers()` in `src/api/driver.ts` | Assignment pool |
| GET | `/drivers/expiring-licenses?withinDays=30` | `listExpiringLicenses(withinDays)` in `src/api/driver.ts` | Compliance view |

## Trips

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| POST | `/trips` | `createTrip()` in `src/api/trip.ts` | Create a draft trip |
| GET | `/trips` | `listTrips()` in `src/api/trip.ts` | Supports `status`, `page`, `limit` |
| GET | `/trips/:id` | `getTrip(id)` in `src/api/trip.ts` | Trip detail view |
| PATCH | `/trips/:id` | `updateTrip(id, payload)` in `src/api/trip.ts` | Edit a draft trip |
| POST | `/trips/:id/dispatch` | `dispatchTrip(id)` in `src/api/trip.ts` | Draft → dispatched |
| POST | `/trips/:id/complete` | `completeTrip(id, payload)` in `src/api/trip.ts` | Completed trip with odometer and fuel data |
| POST | `/trips/:id/cancel` | `cancelTrip(id)` in `src/api/trip.ts` | Cancel a dispatched trip |
| DELETE | `/trips/:id` | `deleteTrip(id)` in `src/api/trip.ts` | Delete while draft-only |

## Maintenance

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| POST | `/maintenance` | `createMaintenance()` in `src/api/maintenance.ts` | Create a maintenance record |
| GET | `/maintenance` | `listMaintenance()` in `src/api/maintenance.ts` | Supports `vehicle`, `status`, `page`, `limit` |
| GET | `/maintenance/:id` | `getMaintenance(id)` in `src/api/maintenance.ts` | Maintenance detail view |
| PATCH | `/maintenance/:id` | `updateMaintenance(id, payload)` in `src/api/maintenance.ts` | Edit cost, description, dates |
| POST | `/maintenance/:id/close` | `closeMaintenance(id)` in `src/api/maintenance.ts` | Close the record and restore vehicle status when applicable |

## Fuel Logs and Expenses

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| POST | `/fuel-logs` | `createFuelLog()` in `src/api/fuel-log.ts` | Record a fuel entry, optionally tied to a trip |
| GET | `/fuel-logs` | `listFuelLogs()` in `src/api/fuel-log.ts` | Supports `vehicle`, `from`, `to`, `page`, `limit` |
| POST | `/expenses` | `createExpense()` in `src/api/expense.ts` | Record toll or other expense |
| GET | `/expenses` | `listExpenses()` in `src/api/expense.ts` | Supports `vehicle`, `type`, `from`, `to`, `page`, `limit` |

## Reports

| Method | Route | Frontend wrapper | Notes |
|---|---|---|---|
| GET | `/reports/fuel-efficiency` | `getFuelEfficiencyReport()` in `src/api/reports.ts` | Supports `vehicle`, `from`, `to` |
| GET | `/reports/fleet-utilization` | `getFleetUtilizationReport()` in `src/api/reports.ts` | Fleet utilization percentage report |
| GET | `/reports/operational-cost` | `getOperationalCostReport()` in `src/api/reports.ts` | Fuel + maintenance, vehicle or fleet-wide |
| GET | `/reports/vehicle-roi` | `getVehicleRoiReport()` in `src/api/reports.ts` | ROI report using trip revenue |
| GET | `/reports/export.csv?report=...` | `exportReportCsv(report)` in `src/api/reports.ts` | CSV export for `fuel-efficiency`, `fleet-utilization`, `operational-cost`, or `vehicle-roi` |
| GET | `/reports/export.pdf?report=...` | `exportReportPdf(report)` in `src/api/reports.ts` | PDF export |

## Frontend Usage Notes

- Use the auth helpers in `src/api/auth.ts` to manage sign-in state.
- Call `getCurrentUser()` on app load to decide which navigation items or pages to show.
- Prefer the list helpers for tables and filter state, and the detail helpers for drawers or edit forms.
- For exports, `exportReportCsv()` returns text and `exportReportPdf()` returns a `Blob` suitable for download.
