import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  VehicleLogPayload,
  FacilityLogPayload,
  SimulationStatusResponse,
  EntitiesResponse,
  AmbulanceVehicle,
  MedicalFacility,
} from '@gis-medical/shared';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UseGisMedicalOptions {
  onVehicleLog?: (payload: VehicleLogPayload) => void;
  onFacilityLog?: (payload: FacilityLogPayload) => void;
}

export function useGisMedical(options: UseGisMedicalOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [vehicles, setVehicles] = useState<AmbulanceVehicle[]>([]);
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const socket = io(`${WS_URL}/gis-medical`, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('vehicle:log', (payload: VehicleLogPayload) => {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === payload.vehicleId ? { ...v, isBusy: payload.isBusyState } : v,
        ),
      );
      optionsRef.current.onVehicleLog?.(payload);
    });

    socket.on('facility:log', (payload: FacilityLogPayload) => {
      setFacilities((prev) =>
        prev.map((f) =>
          f.id === payload.facilityId
            ? { ...f, availableBeds: payload.availableBedsState }
            : f,
        ),
      );
      optionsRef.current.onFacilityLog?.(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const fetchEntities = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical`);
    const data: EntitiesResponse = await res.json();
    setVehicles(data.vehicles);
    setFacilities(data.facilities);
  }, []);

  const fetchSimulationStatus = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical/simulation/status`);
    const data: SimulationStatusResponse = await res.json();
    setSimulationRunning(data.running);
  }, []);

  const startSimulation = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical/simulation/start`, {
      method: 'POST',
    });
    const data: SimulationStatusResponse = await res.json();
    setSimulationRunning(data.running);
  }, []);

  const stopSimulation = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical/simulation/stop`, {
      method: 'POST',
    });
    const data: SimulationStatusResponse = await res.json();
    setSimulationRunning(data.running);
  }, []);

  return {
    connected,
    vehicles,
    facilities,
    simulationRunning,
    fetchEntities,
    fetchSimulationStatus,
    startSimulation,
    stopSimulation,
  };
}
