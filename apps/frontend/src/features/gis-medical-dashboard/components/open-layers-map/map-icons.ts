import { Style, Icon } from 'ol/style';
import { MedicalFacilityType } from '@gis-medical/shared';
import { FeatureLike } from 'ol/Feature';

function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ICONS: Record<string, string> = {
  [MedicalFacilityType.HOSPITAL]: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#0891b2" stroke="#fff" stroke-width="2"/>
    <rect x="13" y="8" width="6" height="16" rx="1" fill="#fff"/>
    <rect x="8" y="13" width="16" height="6" rx="1" fill="#fff"/>
  </svg>`,

  [MedicalFacilityType.CLINIC]: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#0d9488" stroke="#fff" stroke-width="2"/>
    <rect x="10" y="10" width="12" height="12" rx="2" fill="#fff"/>
    <path d="M16 13v6M13 16h6" stroke="#0d9488" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  [MedicalFacilityType.FIELD_MEDICAL_STATION]: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#059669" stroke="#fff" stroke-width="2"/>
    <path d="M11 18l3-6h4l3 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="16" cy="12" r="2" fill="#fff"/>
  </svg>`,

  vehicle_available: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#38A169" stroke="#fff" stroke-width="2"/>
    <path d="M10 16h12M16 10v12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="16" r="4" fill="none" stroke="#fff" stroke-width="1.5"/>
  </svg>`,

  vehicle_busy: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#E53E3E" stroke="#fff" stroke-width="2"/>
    <path d="M11 16l3 3 7-7" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

export function facilityIconStyle(feature: FeatureLike): Style {
  const type = feature.get('facilityType') as MedicalFacilityType;
  const svg = ICONS[type] || ICONS[MedicalFacilityType.CLINIC];

  return new Style({
    image: new Icon({
      src: createSvgDataUri(svg),
      scale: 1,
      anchor: [0.5, 1],
      size: [32, 40],
    }),
  });
}

export function vehicleIconStyle(feature: FeatureLike): Style {
  const isBusy = feature.get('isBusy') as boolean;
  const svg = isBusy ? ICONS.vehicle_busy : ICONS.vehicle_available;

  return new Style({
    image: new Icon({
      src: createSvgDataUri(svg),
      scale: 1,
      anchor: [0.5, 1],
      size: [32, 40],
    }),
  });
}
