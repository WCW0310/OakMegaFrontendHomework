import { useState, useEffect } from "react";
import type { NearbyItem } from "../types";
import { getNearbyLocations } from "../services/nearbyLocationsService";

const DEFAULT_LOCATION = {
  lat: 24.9722,
  lng: 121.4442,
};

interface Location {
  lat: number;
  lng: number;
}

export function useNearbyLocations(
  enabled: boolean,
  userLocation: Location | null,
) {
  const [nearbyStops, setNearbyStops] = useState<NearbyItem[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    const targetLat = userLocation ? userLocation.lat : DEFAULT_LOCATION.lat;
    const targetLng = userLocation ? userLocation.lng : DEFAULT_LOCATION.lng;

    const fetchNearby = async () => {
      try {
        const data = await getNearbyLocations(targetLng, targetLat);

        if (!ignore) {
          setNearbyStops(data);
          console.log(
            `Stops updated for: ${userLocation ? "User" : "Default"}`,
          );
        }
      } catch (error) {
        if (!ignore) console.error("Failed to fetch nearby stops:", error);
      }
    };

    fetchNearby();

    return () => {
      ignore = true;
    };
  }, [enabled, userLocation]);

  return { nearbyStops };
}
