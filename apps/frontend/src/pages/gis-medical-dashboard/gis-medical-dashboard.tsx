import { useEffect } from 'react';
import { useGisMedical } from '../../hooks/use-gis-medical';
import { OpenLayersMap } from './components/open-layers-map';
import { Sidebar } from './components/sidebar';
import { DetailPanel } from './components/detail-panel';

export const GISMedicalDashboardPage = () => {
  const { fetchEntities, fetchSimulationStatus, startSimulation, stopSimulation } =
    useGisMedical();

  useEffect(() => {
    fetchEntities();
    fetchSimulationStatus();
  }, [fetchEntities, fetchSimulationStatus]);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        onStartSimulation={startSimulation}
        onStopSimulation={stopSimulation}
      />
      <div className="relative flex-1">
        <OpenLayersMap />
        <DetailPanel />
      </div>
    </main>
  );
};
