# TransitOps — API Endpoints

REST, JSON. All routes except `/auth/login` and `/auth/register` require a
valid JWT (`Authorization: Bearer <token>`). Role column shows who's allowed
to call it — enforce with a `RolesGuard` reading `UserRole` off the token.

Legend: FM = Fleet Manager, DR = Driver, SO = Safety Officer, FA = Financial Analyst.
"All" = any authenticated role.

## 1. Auth (3.1)
| Method | Route | Role | Notes |
|---|---|---|---|
| POST | `/auth/register` | — | Create a user (or seed via script if you don't want open signup) |
| POST | `/auth/login` | — | Email + password → JWT |
| GET | `/auth/me` | All | Return current user + role, for the frontend to gate UI |

## 2. Dashboard (3.2)
| Method | Route | Role | Notes |
|---|---|---|---|
| GET | `/dashboard/kpis` | All | Active Vehicles, Available Vehicles, In Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization % |
| GET | `/dashboard/kpis?type=&status=&region=` | All | Same, filtered — mirrors the required dashboard filters |

## 3. Vehicles (3.3)
| Method | Route | Role | Notes |
|---|---|---|---|
| POST | `/vehicles` | FM | Create; reject duplicate `registrationNumber` |
| GET | `/vehicles` | All | List; support `?status=&type=&region=` query filters |
| GET | `/vehicles/:id` | All | Single vehicle detail |
| PATCH | `/vehicles/:id` | FM | Edit vehicle master data |
| DELETE | `/vehicles/:id` | FM | Soft-delete or block if it has trip/maintenance history — your call |
| GET | `/vehicles/available` | DR, FM | Dispatch-selection pool: excludes `IN_SHOP` and `RETIRED` |

## 4. Drivers (3.4)
| Method | Route | Role | Notes |
|---|---|---|---|
| POST | `/drivers` | FM, SO | Create driver profile |
| GET | `/drivers` | All | List; support `?status=` filter |
| GET | `/drivers/:id` | All | Single driver detail |
| PATCH | `/drivers/:id` | FM, SO | Edit profile, safety score, status |
| DELETE | `/drivers/:id` | FM | Soft-delete |
| GET | `/drivers/available` | DR, FM | Assignment pool: excludes `SUSPENDED` and expired-license drivers |
| GET | `/drivers/expiring-licenses?withinDays=30` | SO | Compliance view — also backs the bonus "email reminders" feature |

## 5. Trips (3.5)
| Method | Route | Role | Notes |
|---|---|---|---|
| POST | `/trips` | DR | Create Draft trip — validates cargo weight ≤ vehicle max load |
| GET | `/trips` | All | List; support `?status=` filter |
| GET | `/trips/:id` | All | Single trip detail |
| PATCH | `/trips/:id` | DR | Edit a Draft trip (source/destination/cargo/etc. before dispatch) |
| POST | `/trips/:id/dispatch` | DR, FM | Draft → Dispatched; flips vehicle + driver to `ON_TRIP`. Re-validates both are still `AVAILABLE` |
| POST | `/trips/:id/complete` | DR, FM | Dispatched → Completed; body: `{ finalOdometerKm, fuelConsumedLiters }`; flips vehicle + driver back to `AVAILABLE` |
| POST | `/trips/:id/cancel` | DR, FM | Dispatched → Cancelled; restores vehicle + driver to `AVAILABLE` |
| DELETE | `/trips/:id` | FM | Only allowed while still `Draft` |

## 6. Maintenance (3.6)
| Method | Route | Role | Notes |
|---|---|---|---|
| POST | `/maintenance` | FM | Create record → vehicle status auto-set to `IN_SHOP` |
| GET | `/maintenance` | All | List; support `?vehicle=&status=` filter |
| GET | `/maintenance/:id` | All | Single record |
| PATCH | `/maintenance/:id` | FM | Edit cost/description/dates |
| POST | `/maintenance/:id/close` | FM | Closes record → vehicle back to `AVAILABLE` unless `RETIRED` |

## 7. Fuel & Expenses (3.7)
| Method | Route | Role | Notes |
|---|---|---|---|
| POST | `/fuel-logs` | DR, FM | Record a fuel entry, optionally tied to a `trip` |
| GET | `/fuel-logs` | All | List; support `?vehicle=&from=&to=` filter |
| POST | `/expenses` | DR, FM, FA | Record toll/other expense |
| GET | `/expenses` | All | List; support `?vehicle=&type=&from=&to=` filter |
| GET | `/vehicles/:id/operational-cost` | FA, FM | Sum of Fuel + Maintenance for that vehicle |

## 8. Reports & Analytics (3.8)
| Method | Route | Role | Notes |
|---|---|---|---|
| GET | `/reports/fuel-efficiency` | FA, FM | Distance / Fuel, per vehicle; support `?vehicle=&from=&to=` |
| GET | `/reports/fleet-utilization` | FA, FM | % of vehicles `ON_TRIP` over a date range |
| GET | `/reports/operational-cost` | FA | Fuel + Maintenance, per vehicle or fleet-wide |
| GET | `/reports/vehicle-roi` | FA | `(Revenue − (Maintenance + Fuel)) / AcquisitionCost` — needs a `revenue` figure per trip; add that field if you're scoring this |
| GET | `/reports/export.csv?report=fuel-efficiency\|fleet-utilization\|operational-cost\|vehicle-roi` | FA, FM | CSV export (mandatory) |
| GET | `/reports/export.pdf?report=...` | FA, FM | PDF export (bonus/optional) |

## Cross-cutting notes
- Every mutating route on Vehicle/Driver/Trip status should run inside a Mongo
  transaction — see `TripService` and `MaintenanceService` in the README for
  which fields move together.
- 403 (not 404) when a role-restricted route is hit by the wrong role — makes
  RBAC demoable and debuggable during judging.
- Pagination (`?page=&limit=`) on all list endpoints (`/vehicles`, `/drivers`,
  `/trips`, `/maintenance`, `/fuel-logs`, `/expenses`) — cheap to add now,
  saves you from a frozen table demo later.