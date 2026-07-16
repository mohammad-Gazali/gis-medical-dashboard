import syJson from '../../assets/syria-governorates.json';

type Polygon = number[][][];
type MultiPolygon = number[][][][];

interface Feature {
  geometry: { type: string; coordinates: Polygon | MultiPolygon };
  properties: { name: string };
}

const features = (syJson as { features: Feature[] }).features;

const ARABIC_NAMES: Record<string, string> = {
  'Damascus': 'دمشق',
  'Rif Dimashq': 'ريف دمشق',
  'Aleppo': 'حلب',
  'Homs (Hims)': 'حمص',
  'Hamah': 'حماة',
  'Lattakia': 'اللاذقية',
  'Tartus': 'طرطوس',
  'Idlib': 'إدلب',
  'Dayr Az Zawr': 'دير الزور',
  'Ar Raqqah': 'الرقة',
  'Hasaka (Al Haksa)': 'الحسكة',
  "As Suwayda'": 'السويداء',
  'Dar`a': 'درعا',
  'Quneitra': 'القنيطرة',
};

function rayCast(point: [number, number], polygon: number[][]): boolean {
  const [px, py] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInCoordinates(
  point: [number, number],
  coordinates: number[][][],
): boolean {
  return coordinates.some((ring) => rayCast(point, ring));
}

export function getGovernorate(
  coordinates: [number, number],
): string | null {
  for (const feature of features) {
    const geom = feature.geometry;
    let hit = false;

    if (geom.type === 'Polygon') {
      hit = pointInCoordinates(coordinates, geom.coordinates as Polygon);
    } else if (geom.type === 'MultiPolygon') {
      hit = (geom.coordinates as MultiPolygon).some((polygon) =>
        pointInCoordinates(coordinates, polygon),
      );
    }

    if (hit) return feature.properties.name;
  }

  return null;
}

export function getGovernorateArabic(
  coordinates: [number, number],
): string | null {
  const en = getGovernorate(coordinates);
  return en ? (ARABIC_NAMES[en] ?? en) : null;
}

export const GOVERNORATES = features
  .map((f) => ({
    id: f.properties.name,
    label: ARABIC_NAMES[f.properties.name] ?? f.properties.name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'ar'));
