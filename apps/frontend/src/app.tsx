import { OpenLayersMap } from './components/open-layers-map';
import { Sidebar } from './components/sidebar';

export const App = () => {
  return (
    <main className='flex '>
      <OpenLayersMap />
      <Sidebar />
    </main>
  );
};
