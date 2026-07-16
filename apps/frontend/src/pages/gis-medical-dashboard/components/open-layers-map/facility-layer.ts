import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { MedicalFacility, MedicalFacilityType } from '@gis-medical/shared';

const FACILITY_COLORS: Record<MedicalFacilityType, { fill: string; stroke: string }> = {
  [MedicalFacilityType.HOSPITAL]: { fill: '#0891b2', stroke: '#0e7490' },
  [MedicalFacilityType.CLINIC]: { fill: '#0d9488', stroke: '#0f766e' },
  [MedicalFacilityType.FIELD_MEDICAL_STATION]: { fill: '#059669', stroke: '#047857' },
};

const FACILITY_LABELS: Record<MedicalFacilityType, string> = {
  [MedicalFacilityType.HOSPITAL]: 'Hospital',
  [MedicalFacilityType.CLINIC]: 'Clinic',
  [MedicalFacilityType.FIELD_MEDICAL_STATION]: 'Field Station',
};

function facilityStyle(feature: Feature): Style {
  const type = feature.get('facilityType') as MedicalFacilityType;
  const colors = FACILITY_COLORS[type] || FACILITY_COLORS[MedicalFacilityType.CLINIC];

  return new Style({
    image: new CircleStyle({
      radius: 8,
      fill: new Fill({ color: colors.fill }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
    }),
    text: new Text({
      text: FACILITY_LABELS[type] || '',
      font: '11px "Noto Kufi Arabic", sans-serif',
      fill: new Fill({ color: '#1a1c1e' }),
      stroke: new Stroke({ color: '#ffffff', width: 3 }),
      offsetY: -18,
    }),
  });
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
