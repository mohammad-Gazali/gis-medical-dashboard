import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke } from 'ol/style';
import syriaData from '../../../../assets/syria-governorates.json';

export const getSyriaMaskLayer = () => {
  // 1. FIX THE JSON: Remove trailing spaces from all keys in your JSON
  const cleanGeoJSON = (obj: JsonValue): JsonValue => {
    if (Array.isArray(obj)) {
      return obj.map(cleanGeoJSON);
    }

    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        // We cast obj to JsonObject to safely access the key
        acc[key.trim()] = cleanGeoJSON((obj as JsonObject)[key]);
        return acc;
      }, {} as JsonObject);
    }

    return obj;
  };

  const cleanedData = cleanGeoJSON(syriaData);

  // 2. Parse GeoJSON into OpenLayers Features
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(cleanedData, {
      dataProjection: 'EPSG:4326', // Standard GPS coordinates in your JSON
      featureProjection: 'EPSG:3857', // The projection OpenLayers uses for the map
    }),
  });

  // 3. Create the Highlight Style
  const regionStyle = new Style({
    fill: new Fill({
      color: 'rgba(255, 140, 0, 0.25)', // Semi-transparent orange highlight
    }),
    stroke: new Stroke({
      color: '#D84315', // Dark orange/red border for the regions
      width: 2,
    }),
  });

  // 4. Create Vector Layer
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: regionStyle,
  });

  return vectorLayer;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | Array<JsonValue>;
interface JsonObject {
  [key: string]: JsonValue;
}
