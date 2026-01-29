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
      // 1. 取得 GeoJSON 座標 (是 [經度, 緯度])
      const rawCoords = feature.geometry.coordinates[0];

      // 2. 轉換成 Leaflet 需要的 [緯度, 經度]
      const boundary: [number, number][] = rawCoords.map((coord) => [
        coord[1],
        coord[0],
      ]);

      // 3. 計算中心點 (簡單平均法)
      const latSum = boundary.reduce((sum, p) => sum + p[0], 0);
      const lngSum = boundary.reduce((sum, p) => sum + p[1], 0);
      const center: [number, number] = [
        latSum / boundary.length,
        lngSum / boundary.length,
      ];

      return {
        id: index, // 因為原始資料沒 ID，暫用 index
        boundary: boundary,
        center: center,
      };
    });
  } catch (error) {
    console.error("Fetch zones failed:", error);
    return [];
  }
};
