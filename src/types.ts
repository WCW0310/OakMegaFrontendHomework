import type { GeoJsonObject } from "geojson";

export interface RenewalZone {
  id: number;
  geoJsonData: GeoJsonObject;
}

export interface UserProfile {
  google?: { name: string; picture: string };
  facebook?: { name: string; picture: string };
  exp?: number;
}

// polygonsService
export interface GeoJsonResponse {
  result: {
    features: GeoJsonObject[];
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
