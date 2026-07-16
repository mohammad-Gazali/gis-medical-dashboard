import { create } from 'zustand';
import {
  AmbulanceVehicle,
  MedicalFacility,
  MedicalFacilityType,
} from '@gis-medical/shared';
import { GOVERNORATES } from '../lib/geo/governorate';

export type SelectedItem =
  | {
      kind: 'facility';
      id: number;
      name: string;
      type: MedicalFacilityType;
      totalBeds: number;
      availableBeds: number;
    }
  | {
      kind: 'vehicle';
      id: number;
      plateNumber: string;
      isBusy: boolean;
    }
  | null;

export interface FilterItem {
  id: string;
  label: string;
  checked: boolean;
}

export type VehicleFilter = 'all' | 'busy' | 'available' | 'none';

const FACILITY_TYPE_LABELS: Record<MedicalFacilityType, string> = {
  [MedicalFacilityType.HOSPITAL]: 'مستشفى',
  [MedicalFacilityType.CLINIC]: 'عيادة',
  [MedicalFacilityType.FIELD_MEDICAL_STATION]: 'نقطة ميدانية',
};

interface GisMedicalState {
  connected: boolean;
  vehicles: AmbulanceVehicle[];
  facilities: MedicalFacility[];
  simulationRunning: boolean;
  selectedItem: SelectedItem;
  facilityFilters: FilterItem[];
  regionFilters: FilterItem[];
  vehicleFilter: VehicleFilter;
  filterDatetime: string;

  setConnected: (connected: boolean) => void;
  setVehicles: (vehicles: AmbulanceVehicle[]) => void;
  setFacilities: (facilities: MedicalFacility[]) => void;
  setSimulationRunning: (running: boolean) => void;
  setSelectedItem: (item: SelectedItem) => void;
  toggleFacilityFilter: (id: string) => void;
  toggleRegionFilter: (id: string) => void;
  setVehicleFilter: (filter: VehicleFilter) => void;
  setFilterDatetime: (dt: string) => void;
  updateVehicle: (id: number, patch: Partial<AmbulanceVehicle>) => void;
  updateFacility: (id: number, patch: Partial<MedicalFacility>) => void;
}

export const useGisMedicalStore = create<GisMedicalState>((set) => ({
  connected: false,
  vehicles: [],
  facilities: [],
  simulationRunning: false,
  selectedItem: null,
  facilityFilters: Object.values(MedicalFacilityType).map((t) => ({
    id: t,
    label: FACILITY_TYPE_LABELS[t],
    checked: true,
  })),
  regionFilters: GOVERNORATES.map((g) => ({
    id: g.id,
    label: g.label,
    checked: true,
  })),
  vehicleFilter: 'all',
  filterDatetime: '',

  setConnected: (connected) => set({ connected }),
  setVehicles: (vehicles) => set({ vehicles }),
  setFacilities: (facilities) => set({ facilities }),
  setSimulationRunning: (running) => set({ simulationRunning: running }),
  setSelectedItem: (item) => set({ selectedItem: item }),

  toggleFacilityFilter: (id) =>
    set((state) => ({
      facilityFilters: state.facilityFilters.map((f) =>
        f.id === id ? { ...f, checked: !f.checked } : f,
      ),
    })),

  toggleRegionFilter: (id) =>
    set((state) => ({
      regionFilters: state.regionFilters.map((r) =>
        r.id === id ? { ...r, checked: !r.checked } : r,
      ),
    })),

  setVehicleFilter: (filter) => set({ vehicleFilter: filter }),

  setFilterDatetime: (dt) => set({ filterDatetime: dt }),

  updateVehicle: (id, patch) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...patch } : v,
      ),
    })),

  updateFacility: (id, patch) =>
    set((state) => ({
      facilities: state.facilities.map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    })),
}));
