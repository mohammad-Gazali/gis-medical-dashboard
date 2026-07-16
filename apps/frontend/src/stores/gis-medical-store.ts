import { create } from 'zustand';
import {
  AmbulanceVehicle,
  MedicalFacility,
  MedicalFacilityType,
} from '@gis-medical/shared';

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

interface GisMedicalState {
  connected: boolean;
  vehicles: AmbulanceVehicle[];
  facilities: MedicalFacility[];
  simulationRunning: boolean;
  selectedItem: SelectedItem;
  facilityFilters: FilterItem[];
  statusFilters: FilterItem[];

  setConnected: (connected: boolean) => void;
  setVehicles: (vehicles: AmbulanceVehicle[]) => void;
  setFacilities: (facilities: MedicalFacility[]) => void;
  setSimulationRunning: (running: boolean) => void;
  setSelectedItem: (item: SelectedItem) => void;
  toggleFacilityFilter: (id: string) => void;
  toggleStatusFilter: (id: string) => void;
  updateVehicle: (id: number, patch: Partial<AmbulanceVehicle>) => void;
  updateFacility: (id: number, patch: Partial<MedicalFacility>) => void;
}

export const useGisMedicalStore = create<GisMedicalState>((set) => ({
  connected: false,
  vehicles: [],
  facilities: [],
  simulationRunning: false,
  selectedItem: null,
  facilityFilters: [
    { id: 'hospital', label: 'مستشفيات', checked: true },
    { id: 'clinic', label: 'عيادات', checked: true },
    { id: 'field-station', label: 'نقاط إسعاف ميدانية', checked: true },
  ],
  statusFilters: [
    { id: 'operational', label: 'تشغيلي', checked: true },
    { id: 'warning', label: 'تحذير', checked: true },
    { id: 'critical', label: 'حرج', checked: true },
  ],

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

  toggleStatusFilter: (id) =>
    set((state) => ({
      statusFilters: state.statusFilters.map((s) =>
        s.id === id ? { ...s, checked: !s.checked } : s,
      ),
    })),

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
