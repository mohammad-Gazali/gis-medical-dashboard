# GIS Medical Dashboard

Real-time tracking of medical facilities and ambulance vehicles across Syria. Built as an Nx monorepo with NestJS backend, React frontend, PostgreSQL/PostGIS database, and WebSocket-based real-time updates. The interface is Arabic/RTL.

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Nx 23 + Bun |
| Backend | NestJS 11, Sequelize 6, PostgreSQL + PostGIS |
| Real-time | Socket.IO (namespace: `gis-medical`) |
| Frontend | React 19, Vite 8, Tailwind CSS 4, Zustand |
| Map | OpenLayers 10 |
| Backend Tests | Jest 30 |
| Frontend Tests | Vitest 4 + @testing-library/react |
| E2E Tests | Jest + axios |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier (singleQuote: true) |

## Prerequisites

- Node.js 20+
- Bun (package manager)
- PostgreSQL 14+ with PostGIS extension enabled

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Enable PostGIS extension (run once in psql)
CREATE EXTENSION IF NOT EXISTS postgis;

# Run database migrations
bun run db:migrate

# Seed the database
bun run seed

# Start development servers
bun run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:4200`

### Docker

```bash
# Build and start all services
docker compose up -d

# Run migrations (after services are up)
docker compose exec backend npx sequelize-cli db:migrate

# Seed database (optional)
docker compose exec backend npx tsx src/scripts/seed.ts

# View logs
docker compose logs -f

# Stop services
docker compose down
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:3000/api`
- Database: `localhost:5432`

## Development Commands

```bash
# Backend
nx serve backend                   # Start backend server
nx build backend                   # Production build
nx test backend                    # Run backend tests
nx lint backend                    # Lint backend

# Frontend
nx serve frontend                  # Start frontend dev server
nx build frontend                  # Production build
nx test frontend                   # Run frontend tests
nx lint frontend                   # Lint frontend

# Database Migrations
bun run db:migrate                 # Run pending migrations
bun run db:migrate:undo            # Undo last migration
bun run db:migrate:undo:all        # Undo all migrations
bun run db:migrate:status          # Check migration status
bun run db:migrate:generate <name> # Generate new migration file

# Seed
bun run seed                       # Seed database with test data

# Format
bun run format                     # Format code with Prettier
```

## Project Structure

```
gis-medical-dashboard/
├── apps/
│   ├── backend/                            # NestJS application
│   │   ├── .sequelizerc                    # Sequelize CLI path config
│   │   └── src/
│   │       ├── main.ts                     # NestJS bootstrap
│   │       ├── app/
│   │       │   ├── models/                 # Sequelize models (5)
│   │       │   ├── modules/
│   │       │   │   ├── gis-medical/
│   │       │   │   │   ├── services/       # Business logic
│   │       │   │   │   ├── repositories/   # Data access layer
│   │       │   │   │   ├── gis-medical.controller.ts
│   │       │   │   │   ├── gis-medical.gateway.ts    # Socket.IO
│   │       │   │   │   └── gis-medical.module.ts
│   │       │   │   └── seeders/
│   │       │   │       └── services/
│   │       │   │           └── gis-medical.seeder.ts
│   │       │   ├── app.module.ts
│   │       │   ├── app.controller.ts
│   │       │   └── app.service.ts
│   │       ├── database/
│   │       │   ├── config/config.js        # DB config (CJS, dotenv)
│   │       │   ├── migrations/             # Sequelize migrations
│   │       └── scripts/
│   │           └── seed.ts
│   ├── frontend/                           # React application
│   │   └── src/
│   │       ├── main.tsx                    # Entry point
│   │       ├── app.tsx                     # Root component
│   │       ├── styles.css                  # Tailwind v4 theme
│   │       ├── assets/
│   │       │   └── syria-governorates.json # Syria GeoJSON
│   │       ├── components/ui               # Reusable UI primitives
│   │       ├── lib/
│   │       │   ├── utils.ts                # cn utility
│   │       │   └── geo/governorate.ts      # Region detection
│   │       └── features/
│   │           └── gis-medical-dashboard/
│   │               ├── gis-medical-dashboard.tsx
│   │               ├── store/
│   │               │   └── gis-medical-store.ts  # Zustand
│   │               ├── hooks/
│   │               │   └── use-gis-medical.ts
│   │               └── components/
│   │                   ├── detail-panel/
│   │                   ├── sidebar/
│   │                   └── open-layers-map/
│   │                       ├── open-layers-map.tsx
│   │                       ├── facility-layer.ts
│   │                       ├── vehicle-layer.ts
│   │                       ├── syria-mask.ts
│   │                       └── map-icons.ts
│   └── backend-e2e/                        # End-to-end tests
├── libs/
│   └── shared/                             # Shared types and DTOs
│       └── src/lib/types.ts
├── DESIGN.md                               # Design system specification
├── PROGRESS.md                             # Implementation progress tracker
└── AGENTS.md                               # AI agent context
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/gis-medical` | Get all facilities and vehicles |
| `POST` | `/api/gis-medical/simulation/start` | Start vehicle simulation |
| `POST` | `/api/gis-medical/simulation/stop` | Stop vehicle simulation |
| `GET` | `/api/gis-medical/simulation/status` | Get simulation status |

## WebSocket

Connect to namespace `gis-medical` for real-time updates.

## Data Models

### MedicalFacility
- `id` (INTEGER, PK)
- `name` (TEXT)
- `type` (ENUM: Hospital, Clinic, Field Medical Station)
- `position` (GEOGRAPHY POINT 4326)
- `totalBeds` (INTEGER)
- `availableBeds` (INTEGER)

### AmbulanceVehicle
- `id` (INTEGER, PK)
- `plateNumber` (TEXT)
- `location` (GEOGRAPHY POINT 4326)
- `isBusy` (BOOLEAN)

### AmbulanceVehicleAction
- `id` (INTEGER, PK)
- `vehicleId` (INTEGER, FK → AmbulanceVehicle)
- `command` (TEXT)

### AmbulanceVehicleHistoryLog
- `id` (INTEGER, PK)
- `vehicleId` (INTEGER, FK → AmbulanceVehicle)
- `isBusyState` (BOOLEAN)
- `locationState` (GEOGRAPHY POINT 4326)

### MedicalFacilityHistoryLog
- `id` (INTEGER, PK)
- `medicalFacilityId` (INTEGER, FK → MedicalFacility)
- `availableBedsState` (INTEGER)

---

## Technical Documentation

This part discuss some of the technical parts of the project that developers team want to mention.

### Architecture Decisions

The architecture used in this project aims to be extensible in future and allow us for more modules and features regarding targeted field of the project.

### Map Implementation

There is no easy implementation for showing the map with GIS related data in React specifically so we needed to use OpenLayers package (which is not specific for React) and implement React components for showing the map.

### Important Notes
There some of the points that was required in the requirements paper and the current implementation didn't cover it well, this can be explained by the following aspects:

1. The requirements was ambiguous in some points especially related to the usage of clustring feature and how the alert will affect the current flow of the ambulance vehicles.
2. The provided deadline was too short which was 48 hours.
3. The developer wanted from this project to be used in the agency future projects which made him make it extensible and ready to scale for new features.
4. Some of the points in the requirements was not fulfilled like the exsitance of library called `react-geo-med-streamer` which increased the time of development think that this point is not an important aspect to develop by himself (the developer).
