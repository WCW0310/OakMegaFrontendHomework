// src/utils/wktParser.ts

export function parseWKT(wkt: string): [number, number][] {
  try {
    // 1. 去掉 "POLYGON((" 和 "))"
    const content = wkt.replace("POLYGON((", "").replace("))", "");

    // 2. 用逗號分割成點的陣列 ["121.x 25.x", "121.y 25.y"]
    const points = content.split(",");

    // 3. 轉換每個點
    return points.map((pointStr) => {
      // 用空格分割經緯度 (注意 WKT 通常是 "經度 緯度")
      const [lng, lat] = pointStr.trim().split(" ").map(Number);

      // Leaflet 需要 [緯度, 經度]
      return [lat, lng];
    });
  } catch (error) {
    console.error("WKT 解析失敗:", wkt, error);
    return [];
  }
}

// 簡單計算多邊形中心點 (給 Marker 用)
export function getPolygonCenter(
  boundary: [number, number][],
): [number, number] {
  if (boundary.length === 0) return [25.033, 121.565]; // 預設台北101
  const latSum = boundary.reduce((sum, p) => sum + p[0], 0);
  const lngSum = boundary.reduce((sum, p) => sum + p[1], 0);
  return [latSum / boundary.length, lngSum / boundary.length];
}
