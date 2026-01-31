import type { GeoJsonResponse, RenewalZone } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINT = "/api/v1/server/xinbei/geolocation-json";

/**
 * Fetches urban renewal zone data (GeoJSON Polygons).
 * @param directory - The target JSON file name on the server (default: "tucheng.json")
 */
export const getPolygons = async (
  directory: string = "tucheng.json",
): Promise<RenewalZone[]> => {
  try {
    const params = new URLSearchParams({ directory });
    const response = await fetch(`${BASE_URL}${API_ENDPOINT}?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: GeoJsonResponse = await response.json();
    const features = data.result.features;

    // Map GeoJSON features to internal model
    // Note: Synthetic IDs are generated as the raw data lacks unique identifiers
    return features.map((feature, index) => ({
      id: index,
      geoJsonData: feature,
    }));
  } catch (error) {
    console.error("[PolygonsService] Failed to fetch zones:", error);
    return [];
  }
};
