import { OpenLayersMap } from './components/open-layers-map';
import { Sidebar } from './components/sidebar';

export const GISMedicalDashboardPage = () => {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <OpenLayersMap />
    </main>
  );
};
