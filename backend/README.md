# TransitOps — Mongoose Schemas (NestJS)

7 entities, mapped 1:1 to the "Expected Database Entities" list in the brief
(Users/Roles folded into one `User` doc with a `role` enum for RBAC).

## Files
```
src/
  common/enums/index.ts        Role + status enums, shared everywhere
  schemas/
    user.schema.ts             Auth + RBAC
    vehicle.schema.ts          Vehicle Registry (3.3)
    driver.schema.ts           Driver Management (3.4)
    trip.schema.ts             Trip Management (3.5)
    maintenance-log.schema.ts  Maintenance (3.6)
    fuel-log.schema.ts         Fuel logging (3.7)
    expense.schema.ts          Tolls / other costs (3.7)
    schemas.module.ts          One-stop MongooseModule.forFeature() registration
```

Drop `src/` into your Nest project root (merge with your existing `src/`), then
`import { SchemasModule } from './schemas/schemas.module'` into `AppModule`
(or wherever you inject models).

## Relationships
- `Trip.vehicle` → `Vehicle`, `Trip.driver` → `Driver`
- `MaintenanceLog.vehicle` → `Vehicle`
- `FuelLog.vehicle` → `Vehicle`, `FuelLog.trip` → `Trip` (optional, enables per-trip fuel efficiency)
- `Expense.vehicle` → `Vehicle`, `Expense.trip` → `Trip` (optional)
- `Driver.userId` → `User` (optional, only if drivers log in themselves)

## Business rules — schema vs. service layer
Schemas enforce what Mongo can enforce declaratively (uniqueness, enums, min/max,
required fields). Everything cross-document goes in your service layer, run inside
a Mongo **transaction** (session) so a trip dispatch can't half-update:

| Rule | Where to enforce |
|---|---|
| Registration number unique | `unique: true` index (schema) ✅ |
| Cargo weight ≤ vehicle max load | `TripService.create()` — load the vehicle, compare `cargoWeightKg` vs `maxLoadCapacityKg` |
| Retired/In Shop vehicles hidden from dispatch | Query filter: `Vehicle.find({ status: 'AVAILABLE' })` in the dispatch-selection endpoint |
| Expired/Suspended drivers can't be assigned | `TripService.create()` — check `licenseExpiryDate > now` and `status === 'AVAILABLE'` |
| Vehicle/driver already On Trip can't be reassigned | Same check, on `Vehicle.status` / `Driver.status` |
| Dispatch → both go `ON_TRIP` | `TripService.dispatch()` updates `Trip.status`, `Vehicle.status`, `Driver.status` together |
| Complete → both go back to `AVAILABLE` | `TripService.complete()` |
| Cancel dispatched trip → restore `AVAILABLE` | `TripService.cancel()` |
| Create active maintenance → vehicle `IN_SHOP` | `MaintenanceService.create()` |
| Close maintenance → vehicle `AVAILABLE` unless `RETIRED` | `MaintenanceService.close()` — check current status before overwriting |
| Total operational cost = Fuel + Maintenance | Aggregation pipeline over `FuelLog` + `MaintenanceLog`, grouped by `vehicle` |
| Vehicle ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost | Aggregation combining `Trip` revenue (if you add a `revenue` field) with the cost aggregation above |

Wrap dispatch/complete/cancel/maintenance-toggle in `session.withTransaction()`
so a crash mid-update can't leave a vehicle `ON_TRIP` with no matching trip.