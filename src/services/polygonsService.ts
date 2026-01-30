import type { GeoJsonResponse, RenewalZone } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 都更地點 Polygon API
export const getPolygons = async (
  directory: string = "tucheng.json",
): Promise<RenewalZone[]> => {
  try {
    const params = new URLSearchParams({ directory });
    const response = await fetch(
      `${BASE_URL}/api/v1/server/xinbei/geolocation-json?${params}`,
    );

    if (!response.ok) {
      throw new Error("API Network error");
    }

    // 解析 API 回傳的 GeoJSON
    const data: GeoJsonResponse = await response.json();
    const features = data.result.features;

    // 資料轉換 (Mapping)
    return features.map((feature, index) => {
      return {
        id: index, // 因為原始資料沒 ID，暫用 index
        geoJsonData: feature,
      };
    });
  } catch (error) {
    console.error("Fetch zones failed:", error);
    return [];
  }
};
