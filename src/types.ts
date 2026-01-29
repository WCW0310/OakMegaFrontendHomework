export interface RenewalZone {
  id: number; // 我們用 index 當作 id
  boundary: [number, number][]; // 轉換後的 [Lat, Lng] 陣列
  center: [number, number]; // 中心點
}

export interface UserProfile {
  google?: { name: string; picture: string; email: string };
  facebook?: { name: string; picture: string; id: string };
}

// polygonsService
export interface GeoJsonResponse {
  result: {
    features: GeoJsonFeature[];
  };
}

export interface GeoJsonFeature {
  geometry: {
    coordinates: number[][][]; // GeoJSON 座標陣列
  };
}

// nearbyLocationsService
export interface NearbyRequest {
  lng: number;
  lat: number;
}

export interface NearbyResponse {
  result: NearbyItem[];
  tod: boolean;
}

export interface NearbyItem {
  id: number;
  stop_name: string;
  name: string;
  longitude: number;
  latitude: number;
  radius: number;
  is_tod: number;
  distance: number;
}
