# AGENTS.md — GIS Medical Dashboard

## Project Overview

GIS Medical Dashboard for real-time tracking of medical facilities and ambulance vehicles across Syria. Built as an Nx monorepo with a NestJS backend, React frontend, PostgreSQL/PostGIS database, and WebSocket-based real-time updates. The interface is Arabic/RTL.

## Architecture

```
apps/
├── backend/          NestJS 11 + Sequelize + PostGIS + Socket.IO
├── frontend/         React 19 + Vite 8 + Tailwind CSS 4 + OpenLayers 10
└── backend-e2e/      End-to-end tests (Jest + axios)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Nx 23 + Bun |
| Backend | NestJS 11, Sequelize 6, PostgreSQL + PostGIS |
| Real-time | Socket.IO (namespace: `gis-medical`) |
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Map | OpenLayers 10 |
| Backend Tests | Jest 30 |
| Frontend Tests | Vitest 4 + @testing-library/react |
| E2E Tests | Jest + axios |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier (singleQuote: true) |

## Commands

```bash
# Development
bun install                        # Install dependencies
nx serve backend                   # Start backend (port 3000, /api prefix)
nx serve frontend                  # Start frontend (port 4200)

# Build
nx build backend                   # Production build (Webpack)
nx build frontend                  # Production build (Vite)

# Test
nx test backend                    # Backend unit tests (Jest)
nx test frontend                   # Frontend unit tests (Vitest)
nx e2e backend-e2e                 # End-to-end tests

# Lint
nx lint backend                    # Lint backend
nx lint frontend                   # Lint frontend (includes React plugin)

# Database Migrations (sequelize-cli)
db:migrate                         # Run pending migrations
db:migrate:undo                    # Undo last migration
db:migrate:undo:all                # Undo all migrations
db:migrate:status                  # Check migration status
db:migrate:generate <name>         # Generate new migration file
```

## Code Conventions

### General
- TypeScript for all code (TS ~6.0)
- Single quotes, Prettier formatting
- No comments unless explicitly requested
- Follow existing patterns; do not introduce new libraries without checking the project first

### Backend (NestJS)
- Controllers handle HTTP, Gateways handle WebSocket
- Services contain business logic and database interactions
- Models use `sequelize-typescript` decorators
- Geographic data: `DataType.GEOGRAPHY('POINT', 4326)` (PostGIS)
- Database: PostgreSQL with snake_case column naming and timestamps enabled
- `synchronize: true` only when `DEBUG=true`
- Environment variables via `@nestjs/config` and `.env`
- Module pattern: feature modules under `modules/` directory
- Models under `models/`, enums under `enums/`, types under `types/`
- Test files use `.spec.ts` suffix, co-located with source files

### Frontend (React)
- Functional components with hooks
- Tailwind CSS for styling (utility classes, no inline styles)
- Component files: `component-name.tsx` (kebab-case)
- Barrel exports via `index.ts` files
- Pages organized under `pages/` directory
- Components co-located with their page under `components/`
- OpenLayers map logic separated into dedicated modules
- RTL layout support (HTML lang="ar" dir="rtl")
- No routing library — single page application

### Data Models

| Model | Table | Key Fields |
|---|---|---|
| `AmbulanceVehicle` | `ambulance_vehicles` | `plateNumber`, `location` (GeoPoint), `isBusy` |
| `AmbulanceVehicleAction` | `ambulance_vehicles_actions` | `vehicleId` (FK), `command` |
| `AmbulanceVehicleHistoryLog` | `ambulance_vehicles_history_logs` | `vehicleId` (FK), `isBusyState` |
| `MedicalFacility` | `medical_facilities` | `name`, `type` (enum), `position` (GeoPoint), `totalBeds`, `availableBeds` |
| `MedicalFacilityHistoryLog` | `medical_facilities_history_logs` | `medicalFacilityId` (FK), `availableBedsState` |

**Enum:** `MedicalFacilityType` — `HOSPITAL`, `CLINIC`, `FIELD_MEDICAL_STATION`

**Entity Relationships:**
- `AmbulanceVehicle` 1→* `AmbulanceVehicleAction`
- `AmbulanceVehicle` 1→* `AmbulanceVehicleHistoryLog`
- `MedicalFacility` 1→* `MedicalFacilityHistoryLog`

## Key Features (Current & Planned)

### Implemented
- OpenLayers map centered on Syria with GeoJSON boundary overlay
- Socket.IO gateway with connection/disconnection handling
- Sequelize models for all entities with PostGIS geography
- WebSocket service hooks for real-time history log notifications
- Sequelize CLI migrations (`.sequelizerc`, CJS config with dotenv)

### In Progress / TODO
- Backend API endpoints for CRUD operations on facilities and vehicles
- Sidebar component for filters and controls
- WebSocket broadcast logic (currently only logs to console)
- Emergency dispatch system (sending commands to ambulance vehicles)

### Planned
- **Filters:** By region (governorate), datetime range, facility type
- **Emergency dispatch:** Send emergency commands to specific ambulance vehicles
- **Real-time updates:** Live vehicle location and facility status via WebSocket
- **Dashboard analytics:** Bed availability, vehicle status, emergency response times

## Design System

Based on [DESIGN.md](DESIGN.md)

## Testing Guidelines

### Backend (Jest)
- Use `@nestjs/testing` `Test.createTestingModule()` pattern
- Test files: `*.spec.ts` co-located with source
- Mock external dependencies (database, WebSocket)

### Frontend (Vitest)
- Use `@testing-library/react` for component tests
- jsdom environment
- Test files: `*.spec.tsx` or `*.test.tsx`
- Coverage output to `coverage/apps/frontend`

### E2E
- Test real HTTP endpoints against running backend
- Global setup waits for port 3000, teardown kills it
- Uses axios with base URL configuration

## Environment Variables

See `.env.example` for required variables. Key ones:
- `DATABASE_URL` or individual PostgreSQL connection vars
- `PORT` (default: 3000)
- `DEBUG` (enables Sequelize synchronize)

## Progress Tracking

**Always read [PROGRESS.md](PROGRESS.md) at the start of a session.** It tracks:
- What has been implemented (`DONE`)
- What is in progress (`WIP`)
- What is planned (`TODO`)
- What is blocked (`BLOCKED`)

Update PROGRESS.md when you complete work, discover new tasks, or change priorities. Keep the file current so the next agent session starts with accurate context.

## Important Notes

- The project uses **Bun** as the package manager (not npm/yarn)
- RTL layout is required — all UI must support right-to-left
- Syria GeoJSON data is pre-bundled at `apps/frontend/src/assets/syria-governorates.json`
- PostGIS extension must be enabled in PostgreSQL
- Sequelize CLI migrations: `.sequelizerc` at `apps/backend/`, config at `apps/backend/src/database/config/config.js`, migrations at `apps/backend/src/database/migrations/`
- Run migrations via: `db:migrate`, `db:migrate:undo`, `db:migrate:undo:all`, `db:migrate:status`
- WebSocket namespace is `gis-medical` — connect to `ws://host:3000/gis-medical`
