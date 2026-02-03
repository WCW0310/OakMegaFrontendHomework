import type { GeoJsonResponse, RenewalZone } from "../types";
import { fetchClient } from "./apiClient";

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
    const data = await fetchClient<GeoJsonResponse>(
      `${API_ENDPOINT}?${params}`,
    );

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
