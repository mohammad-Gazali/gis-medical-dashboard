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
import { useGisMedicalStore } from '../../../../stores/gis-medical-store';

export const OpenLayersMap = () => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map>(null);
  const facilityLayerRef = useRef<VectorLayer | null>(null);
  const vehicleLayerRef = useRef<VectorLayer | null>(null);

  const vehicles = useGisMedicalStore((s) => s.vehicles);
  const facilities = useGisMedicalStore((s) => s.facilities);
  const setSelectedItem = useGisMedicalStore((s) => s.setSelectedItem);

  useEffect(() => {
    if (!mapElement.current) return;

    const syriaMaskLayer = getSyriaMaskLayer();
    const osmLayer = new TileLayer({ source: new OSM() });
    const facilityLayer = createFacilityLayer();
    const vehicleLayer = createVehicleLayer();

    facilityLayerRef.current = facilityLayer;
    vehicleLayerRef.current = vehicleLayer;

    const map = new Map({
      target: mapElement.current,
      layers: [osmLayer, syriaMaskLayer, facilityLayer, vehicleLayer],
      view: new View({
        center: fromLonLat([38.5, 35.0]),
        zoom: 6.5,
      }),
    });

    map.on('singleclick', (evt) => {
      let found = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (found) return true;
        const props = feature.getProperties();
        if (props.facilityType !== undefined) {
          setSelectedItem({
            kind: 'facility',
            id: props.id,
            name: props.name,
            type: props.facilityType,
            totalBeds: props.totalBeds,
            availableBeds: props.availableBeds,
          });
          found = true;
        } else if (props.plateNumber !== undefined) {
          setSelectedItem({
            kind: 'vehicle',
            id: props.id,
            plateNumber: props.plateNumber,
            isBusy: props.isBusy,
          });
          found = true;
        }
        return true;
      });
      if (!found) setSelectedItem(null);
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
      map.dispose();
    };
  }, [setSelectedItem]);

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
