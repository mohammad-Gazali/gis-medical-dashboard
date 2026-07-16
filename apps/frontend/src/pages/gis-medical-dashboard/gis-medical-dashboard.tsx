import { useEffect } from 'react';
import { useGisMedical } from '../../hooks/use-gis-medical';
import { OpenLayersMap } from './components/open-layers-map';
import { Sidebar } from './components/sidebar';

export const GISMedicalDashboardPage = () => {
  const {
    connected,
    vehicles,
    facilities,
    simulationRunning,
    fetchEntities,
    fetchSimulationStatus,
    startSimulation,
    stopSimulation,
  } = useGisMedical();

  useEffect(() => {
    fetchEntities();
    fetchSimulationStatus();
  }, [fetchEntities, fetchSimulationStatus]);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        connected={connected}
        simulationRunning={simulationRunning}
        onStartSimulation={startSimulation}
        onStopSimulation={stopSimulation}
      />
      <OpenLayersMap vehicles={vehicles} facilities={facilities} />
    </main>
  );
};
