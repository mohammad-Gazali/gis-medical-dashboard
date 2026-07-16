export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export enum MedicalFacilityType {
  HOSPITAL = 'Hospital',
  CLINIC = 'Clinic',
  FIELD_MEDICAL_STATION = 'Field Medical Station',
}

export interface MedicalFacility {
  id: number;
  name: string;
  type: MedicalFacilityType;
  position: GeoPoint;
  totalBeds: number;
  availableBeds: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AmbulanceVehicle {
  id: number;
  plateNumber: string;
  location: GeoPoint;
  isBusy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleLogPayload {
  vehicleId: number;
  isBusyState: boolean;
  locationState: GeoPoint;
  timestamp: Date;
}

export interface FacilityLogPayload {
  facilityId: number;
  availableBedsState: number;
  timestamp: Date;
}

export interface SimulationStatusResponse {
  running: boolean;
}

export interface EntitiesResponse {
  facilities: MedicalFacility[];
  vehicles: AmbulanceVehicle[];
}
