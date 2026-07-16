import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { getSyriaMaskLayer } from './syria-mask';

export const OpenLayersMap = () => {
  // 1. Create a ref to hold the DOM element
  const mapElement = useRef<HTMLDivElement>(null);

  // 2. Create a ref to hold the map instance itself
  const mapInstance = useRef<Map>(null);

  useEffect(() => {
    // Prevent initialization if the ref is not attached yet
    if (!mapElement.current) return;

    const syriaMaskLayer = getSyriaMaskLayer();

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // 3. Initialize the OpenLayers Map
    mapInstance.current = new Map({
      target: mapElement.current, // Attach to our React ref
      layers: [osmLayer, syriaMaskLayer],
      view: new View({
        // [Longitude, Latitude] for the center of Syria
        center: fromLonLat([38.5, 35.0]),
        // Zoom level 6.5 is good for viewing a whole country
        zoom: 6.5,
      }),
    });

    // 4. Cleanup function to prevent memory leaks
    return () => {
      if (mapInstance.current) {
        // Detach the map from the DOM element
        mapInstance.current.setTarget(undefined);
        // Dispose of the map to destroy it completely
        mapInstance.current.dispose();
      }
    };
  }, []);

  return <div ref={mapElement} className="map-container w-full h-screen" />;
};
