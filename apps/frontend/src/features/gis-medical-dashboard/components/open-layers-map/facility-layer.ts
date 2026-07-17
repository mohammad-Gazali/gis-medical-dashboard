import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Text, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { MedicalFacility, MedicalFacilityType } from '@gis-medical/shared';
import { facilityIconStyle } from './map-icons';
import { FeatureLike } from 'ol/Feature';

const FACILITY_TYPE_LABELS: Record<MedicalFacilityType, string> = {
  [MedicalFacilityType.HOSPITAL]: 'مستشفى',
  [MedicalFacilityType.CLINIC]: 'عيادة',
  [MedicalFacilityType.FIELD_MEDICAL_STATION]: 'نقطة ميدانية',
};

function facilityStyle(feature: FeatureLike) {
  const styles = facilityIconStyle(feature);

  const label = new Text({
    text: FACILITY_TYPE_LABELS[feature.get('facilityType') as MedicalFacilityType] || '',
    font: '11px "Noto Kufi Arabic", sans-serif',
    fill: new Fill({ color: '#1a1c1e' }),
    stroke: new Stroke({ color: '#ffffff', width: 3 }),
    offsetY: -42,
  });
  styles.setText(label);

  return styles;
}

export function createFacilityLayer(): VectorLayer<VectorSource> {
  return new VectorLayer({
    source: new VectorSource(),
    style: facilityStyle,
    zIndex: 10,
  });
}

export function syncFacilityLayer(
  layer: VectorLayer<VectorSource>,
  facilities: MedicalFacility[],
) {
  const source = layer.getSource();
  if (!source) return;

  const incomingIds = new Set(facilities.map((f) => f.id));

  source.getFeatures().forEach((feature) => {
    if (!incomingIds.has(feature.get('id'))) {
      source.removeFeature(feature);
    }
  });

  for (const facility of facilities) {
    const existing = source
      .getFeatures()
      .find((f) => f.get('id') === facility.id);

    const coords = fromLonLat(facility.position.coordinates);

    if (existing) {
      (existing.getGeometry() as Point).setCoordinates(coords);
      existing.set('availableBeds', facility.availableBeds, true);
    } else {
      const feature = new Feature({
        geometry: new Point(coords),
      });
      feature.set('id', facility.id);
      feature.set('name', facility.name);
      feature.set('facilityType', facility.type);
      feature.set('totalBeds', facility.totalBeds);
      feature.set('availableBeds', facility.availableBeds);
      source.addFeature(feature);
    }
  }
}
