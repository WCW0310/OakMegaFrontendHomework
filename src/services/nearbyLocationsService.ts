import type { NearbyRequest, NearbyResponse, NearbyItem } from "../types";
import { fetchClient } from "./apiClient";

const API_ENDPOINT = "/api/v1/server/xinbei/calc-distance";

/**
 * Fetches nearby Transit-Oriented Development (TOD) stops based on coordinates.
 * Note: Uses POST method as required by the backend contract.
 */
export const getNearbyLocations = async (
  lng: number,
  lat: number,
): Promise<NearbyItem[]> => {
  try {
    const payload: NearbyRequest = { lng, lat };

    const data = await fetchClient<NearbyResponse>(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return data.result || [];
  } catch (error) {
    // Gracefully return empty array to prevent UI crash, but log for debugging
    console.error("[NearbyService] Failed to fetch locations:", error);
    return [];
  }
};
