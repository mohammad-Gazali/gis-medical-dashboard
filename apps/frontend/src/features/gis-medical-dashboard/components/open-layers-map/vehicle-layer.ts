import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Text, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { AmbulanceVehicle } from '@gis-medical/shared';
import { vehicleIconStyle } from './map-icons';
import { FeatureLike } from 'ol/Feature';

function vehicleStyle(feature: FeatureLike) {
  const styles = vehicleIconStyle(feature);

  const label = new Text({
    text: feature.get('plateNumber') as string,
    font: '10px "Noto Kufi Arabic", sans-serif',
    fill: new Fill({ color: '#1a1c1e' }),
    stroke: new Stroke({ color: '#ffffff', width: 3 }),
    offsetY: -42,
  });
  styles.setText(label);

  return styles;
}

export function createVehicleLayer(): VectorLayer<VectorSource> {
  return new VectorLayer({
    source: new VectorSource(),
    style: vehicleStyle,
    zIndex: 20,
  });
}

export function syncVehicleLayer(
  layer: VectorLayer<VectorSource>,
  vehicles: AmbulanceVehicle[],
) {
  const source = layer.getSource();
  if (!source) return;

  const incomingIds = new Set(vehicles.map((v) => v.id));

  source.getFeatures().forEach((feature) => {
    if (!incomingIds.has(feature.get('id'))) {
      source.removeFeature(feature);
    }
  });

  for (const vehicle of vehicles) {
    const existing = source
      .getFeatures()
      .find((f) => f.get('id') === vehicle.id);

    const coords = fromLonLat(vehicle.location.coordinates);

    if (existing) {
      (existing.getGeometry() as Point).setCoordinates(coords);
      existing.set('isBusy', vehicle.isBusy, true);
      existing.changed();
    } else {
      const feature = new Feature({
        geometry: new Point(coords),
      });
      feature.set('id', vehicle.id);
      feature.set('plateNumber', vehicle.plateNumber);
      feature.set('isBusy', vehicle.isBusy);
      source.addFeature(feature);
    }
  }
}
