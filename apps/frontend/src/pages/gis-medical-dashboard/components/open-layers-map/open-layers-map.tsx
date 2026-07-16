import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { getSyriaMaskLayer } from './syria-mask';
import { createFacilityLayer, syncFacilityLayer } from './facility-layer';
import { createVehicleLayer, syncVehicleLayer } from './vehicle-layer';
import { AmbulanceVehicle, MedicalFacility } from '@gis-medical/shared';

interface OpenLayersMapProps {
  vehicles: AmbulanceVehicle[];
  facilities: MedicalFacility[];
}

export const OpenLayersMap = ({ vehicles, facilities }: OpenLayersMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map>(null);
  const facilityLayerRef = useRef<VectorLayer | null>(null);
  const vehicleLayerRef = useRef<VectorLayer | null>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    const syriaMaskLayer = getSyriaMaskLayer();
    const osmLayer = new TileLayer({ source: new OSM() });
    const facilityLayer = createFacilityLayer();
    const vehicleLayer = createVehicleLayer();

    facilityLayerRef.current = facilityLayer;
    vehicleLayerRef.current = vehicleLayer;

    mapInstance.current = new Map({
      target: mapElement.current,
      layers: [osmLayer, syriaMaskLayer, facilityLayer, vehicleLayer],
      view: new View({
        center: fromLonLat([38.5, 35.0]),
        zoom: 6.5,
      }),
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (facilityLayerRef.current) {
      syncFacilityLayer(facilityLayerRef.current, facilities);
    }
  }, [facilities]);

  useEffect(() => {
    if (vehicleLayerRef.current) {
      syncVehicleLayer(vehicleLayerRef.current, vehicles);
    }
  }, [vehicles]);

  return <div ref={mapElement} className="map-container flex-1 h-screen" />;
};
