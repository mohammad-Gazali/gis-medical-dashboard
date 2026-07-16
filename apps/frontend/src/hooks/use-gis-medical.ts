import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  VehicleLogPayload,
  FacilityLogPayload,
  SimulationStatusResponse,
  EntitiesResponse,
} from '@gis-medical/shared';
import { useGisMedicalStore } from '../stores/gis-medical-store';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useGisMedical() {
  const socketRef = useRef<Socket | null>(null);

  const setConnected = useGisMedicalStore((s) => s.setConnected);
  const updateVehicle = useGisMedicalStore((s) => s.updateVehicle);
  const updateFacility = useGisMedicalStore((s) => s.updateFacility);
  const setVehicles = useGisMedicalStore((s) => s.setVehicles);
  const setFacilities = useGisMedicalStore((s) => s.setFacilities);
  const setSimulationRunning = useGisMedicalStore((s) => s.setSimulationRunning);

  useEffect(() => {
    const socket = io(`${WS_URL}/gis-medical`, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('vehicle:log', (payload: VehicleLogPayload) => {
      updateVehicle(payload.vehicleId, { isBusy: payload.isBusyState });
    });

    socket.on('facility:log', (payload: FacilityLogPayload) => {
      updateFacility(payload.facilityId, {
        availableBeds: payload.availableBedsState,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [setConnected, updateVehicle, updateFacility]);

  const fetchEntities = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical`);
    const data: EntitiesResponse = await res.json();
    setVehicles(data.vehicles);
    setFacilities(data.facilities);
  }, [setVehicles, setFacilities]);

  const fetchSimulationStatus = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical/simulation/status`);
    const data: SimulationStatusResponse = await res.json();
    setSimulationRunning(data.running);
  }, [setSimulationRunning]);

  const startSimulation = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical/simulation/start`, {
      method: 'POST',
    });
    const data: SimulationStatusResponse = await res.json();
    setSimulationRunning(data.running);
  }, [setSimulationRunning]);

  const stopSimulation = useCallback(async () => {
    const res = await fetch(`${API_URL}/gis-medical/simulation/stop`, {
      method: 'POST',
    });
    const data: SimulationStatusResponse = await res.json();
    setSimulationRunning(data.running);
  }, [setSimulationRunning]);

  return {
    fetchEntities,
    fetchSimulationStatus,
    startSimulation,
    stopSimulation,
  };
}
