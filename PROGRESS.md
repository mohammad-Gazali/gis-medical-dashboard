# PROGRESS.md — GIS Medical Dashboard

> **Last updated:** 2026-07-16
>
> This file tracks implementation progress and outstanding tasks.
> Agents should read this file at the start of a session and update it when work is completed or priorities change.

---

## Status Legend

| Status | Meaning |
|---|---|
| `DONE` | Fully implemented and verified |
| `WIP` | Partially implemented, in progress |
| `TODO` | Not started, planned |
| `BLOCKED` | Waiting on dependency or decision |

---

## Frontend

### Design System

| Task | Status | Notes |
|---|---|---|
| Tailwind v4 theme tokens (colors, radii, shadows) | `DONE` | All MD3 tokens in `styles.css` `@theme` block |
| Typography scale (display, headline, body, label-caps, data-mono) | `DONE` | Custom utility classes in `@layer utilities` |
| Glassmorphism utility | `DONE` | `.glassmorphism` class with backdrop-blur |
| Font loading (Noto Kufi Arabic) | `DONE` | Loaded via `<link>` in `index.html` (preconnect to Google Fonts) |

### UI Primitives (`src/components/ui/`)

| Component | Status | Notes |
|---|---|---|
| `cn` utility (`src/lib/utils.ts`) | `DONE` | clsx + tailwind-merge |
| `cva` integration | `DONE` | class-variance-authority installed and used |
| `Button` (primary / destructive / ghost) | `DONE` | cva variants, sm/md/lg sizes |
| `Card` (glassmorphism overlay) | `DONE` | cva variants, elevated prop |
| `StatusChip` | `DONE` | cva variants, operational/warning/critical/idle |
| `FilterList` | `DONE` | cn for conditional classes |
| `SidebarPanel` | `DONE` | cn for className merging |

### Pages & Layout

| Task | Status | Notes |
|---|---|---|
| Dashboard layout (sidebar + map, RTL) | `DONE` | Flex container, sidebar on right in RTL |
| Sidebar filters (facility type, status) | `DONE` | Arabic labels, local state toggles |
| OpenLayers map container fix (`flex-1`) | `DONE` | Map fills remaining viewport |
| Sidebar detail panel | `DONE` | Shows entity details on map click, back to filters on close |
| Floating overlay cards (legend, stats) | `TODO` | Glassmorphism cards over map |
| Mobile responsive (bottom sheet sidebar) | `TODO` | Sidebar collapses on small screens |

### Map Features

| Task | Status | Notes |
|---|---|---|
| Syria GeoJSON boundary overlay | `DONE` | Orange fill + dark stroke |
| Facility markers on map | `DONE` | SVG icon markers (hospital/clinic/field station) with Arabic labels |
| Ambulance vehicle markers | `DONE` | SVG icon markers (green=available, red=busy) with plate numbers |
| Emergency pulsing markers | `TODO` | Red glow animation for active incidents |
| Map click → detail panel | `DONE` | Click feature → sidebar shows detail panel with entity info |
| Detail panel (facility info) | `DONE` | Shows name, type, bed capacity with progress bar |
| Detail panel (vehicle info) | `DONE` | Shows plate number, status indicator |

### Real-time (WebSocket)

| Task | Status | Notes |
|---|---|---|
| Socket.IO client connection | `DONE` | `useGisMedical` hook connects to `ws://host:3000/gis-medical` |
| Receive vehicle location updates | `DONE` | Updates map markers in real-time via WS events |
| Receive facility status updates | `DONE` | Updates facility features and bed counts via WS events |

### Emergency Dispatch

| Task | Status | Notes |
|---|---|---|
| Emergency send UI (button + form) | `TODO` | Select vehicle, send command |
| Confirmation dialog | `TODO` | Prevent accidental dispatch |
| Dispatch status feedback | `TODO` | Toast or inline notification |

---

## Backend

### API Endpoints

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/gis-medical` | `DONE` | Returns initial facilities + vehicles (accepts optional `datetime` query) |
| `GET /api/gis-medical/medical-facilities/:id` | `TODO` | Single facility detail |
| `GET /api/gis-medical/ambulance-vehicles/:id` | `TODO` | Single vehicle detail |
| `POST /api/gis-medical/ambulance-vehicles/:id/dispatch` | `TODO` | Send emergency command |

### WebSocket Gateway

| Task | Status | Notes |
|---|---|---|
| Broadcast vehicle changes via afterCreate hooks | `DONE` | Gateway hooks into DB history log creation |
| Broadcast facility changes via afterCreate hooks | `DONE` | Gateway hooks into DB history log creation |
| Broadcast dispatch commands | `TODO` | Notify clients of sent commands |

### Simulation

| Task | Status | Notes |
|---|---|---|
| API-controlled start/stop/status | `DONE` | POST start/stop, GET status endpoints |
| Vehicle movement between facilities | `DONE` | PostGIS ST_Distance for nearest facility |
| Create vehicle history logs | `DONE` | Logs isBusyState changes on every tick |
| Create facility history logs | `DONE` | Logs availableBedsState changes on visit |
| Update vehicle entity | `DONE` | Updates location and isBusy |
| Update facility entity | `DONE` | Updates availableBeds |
| Simulation toggle button | `DONE` | In sidebar, shows running status |

### Database

| Task | Status | Notes |
|---|---|---|
| Seed data for facilities | `DONE` | 112 facilities across 14 governorates (8 per governorate) |
| Seed data for vehicles | `DONE` | ~42 vehicles (3 per governorate) |
| CLI seeder command | `DONE` | `nx seed backend` runs seed via tsx |

---

## Testing

| Task | Status | Notes |
|---|---|---|
| Backend unit tests (existing stubs) | `DONE` | Pass but are minimal |
| Frontend component tests | `TODO` | No test files exist yet |
| E2E tests for new API endpoints | `TODO` | Extend `backend-e2e` |

---

## Open Questions

- [ ] Font loading strategy: Google Fonts `<link>` vs self-hosted?
- [ ] Should the sidebar have a collapse/toggle button?
- [ ] Map marker clustering for dense areas?
- [ ] Authentication/authorization scope?

---

## Changelog

| Date | Change |
|---|---|
| 2026-07-16 | Zustand store for all shared state (filters, entities, selection, simulation); detail panel moved to map overlay (top-left) |
| 2026-07-16 | SVG icon markers for facilities and vehicles; map click → detail panel in sidebar |
| 2026-07-16 | Simulation auto-starts on boot, creates history logs + updates entities; controller returns initial entities with datetime param |
| 2026-07-16 | Refactored services into `services/` folder, CLI seeder, PostGIS queries, env-dependent CORS |
| 2026-07-16 | Added backend seeder, simulation service, CORS, and data endpoints |
| 2026-07-16 | Added `cn` utility and `cva` integration; refactored all UI primitives to use them |
| 2026-07-16 | Initial design system implementation (theme, primitives, sidebar, layout) |
