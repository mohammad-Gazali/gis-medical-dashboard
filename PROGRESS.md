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
| Font loading (Noto Kufi Arabic) | `TODO` | Remove CSS import; load via `<link>` in `index.html` or self-host |

### UI Primitives (`src/components/ui/`)

| Component | Status | Notes |
|---|---|---|
| `Button` (primary / ghost) | `DONE` | sm, md, lg sizes |
| `Card` (glassmorphism overlay) | `DONE` | elevated prop for level-2 shadow |
| `StatusChip` | `DONE` | operational, warning, critical, idle |
| `FilterList` | `DONE` | Checkbox rows with blue tint on checked |
| `SidebarPanel` | `DONE` | Fixed 280px wrapper |

### Pages & Layout

| Task | Status | Notes |
|---|---|---|
| Dashboard layout (sidebar + map, RTL) | `DONE` | Flex container, sidebar on right in RTL |
| Sidebar filters (facility type, status) | `DONE` | Arabic labels, local state toggles |
| OpenLayers map container fix (`flex-1`) | `DONE` | Map fills remaining viewport |
| Floating overlay cards (legend, stats) | `TODO` | Glassmorphism cards over map |
| Mobile responsive (bottom sheet sidebar) | `TODO` | Sidebar collapses on small screens |

### Map Features

| Task | Status | Notes |
|---|---|---|
| Syria GeoJSON boundary overlay | `DONE` | Orange fill + dark stroke |
| Facility markers on map | `TODO` | Medical cross icons for hospitals |
| Ambulance vehicle markers | `TODO` | Real-time position markers |
| Emergency pulsing markers | `TODO` | Red glow animation for active incidents |
| Map popup/tooltip on marker click | `TODO` | Facility or vehicle details |

### Real-time (WebSocket)

| Task | Status | Notes |
|---|---|---|
| Socket.IO client connection | `TODO` | Connect to `ws://host:3000/gis-medical` |
| Receive vehicle location updates | `TODO` | Update markers in real-time |
| Receive facility status updates | `TODO` | Update status chips and bed counts |

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
| `GET /api/gis-medical/medical-facilities` | `TODO` | List all facilities |
| `GET /api/gis-medical/medical-facilities/:id` | `TODO` | Single facility detail |
| `GET /api/gis-medical/ambulance-vehicles` | `TODO` | List all vehicles |
| `GET /api/gis-medical/ambulance-vehicles/:id` | `TODO` | Single vehicle detail |
| `POST /api/gis-medical/ambulance-vehicles/:id/dispatch` | `TODO` | Send emergency command |

### WebSocket Gateway

| Task | Status | Notes |
|---|---|---|
| Broadcast vehicle location changes | `TODO` | Hook exists, broadcast logic TODO |
| Broadcast facility status changes | `TODO` | Hook exists, broadcast logic TODO |
| Broadcast dispatch commands | `TODO` | Notify clients of sent commands |

### Database

| Task | Status | Notes |
|---|---|---|
| Seed data for facilities | `TODO` | Sample hospitals, clinics |
| Seed data for vehicles | `TODO` | Sample ambulance vehicles |

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
| 2026-07-16 | Initial design system implementation (theme, primitives, sidebar, layout) |
