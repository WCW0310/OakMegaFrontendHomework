import type { NearbyRequest, NearbyResponse, NearbyItem } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 附近的都更地點 API
export const getNearbyLocations = async (
  lng: number,
  lat: number,
): Promise<NearbyItem[]> => {
  try {
    const payload: NearbyRequest = {
      lng,
      lat,
    };

    const response = await fetch(
      `${BASE_URL}/api/v1/server/xinbei/calc-distance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Nearby API Error: ${response.status}`);
    }

    const data: NearbyResponse = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Failed to fetch nearby locations:", error);
    return [];
  }
};
