import { useState, useEffect } from "react";
import type { RenewalZone } from "../types";
import { getPolygons } from "../services/polygonsService";

export function useRenewalZones(enabled: boolean) {
  const [zones, setZones] = useState<RenewalZone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchZones = async () => {
      try {
        setIsLoading(true);
        const data = await getPolygons();
        setZones(data);
      } catch (error) {
        console.error("Failed to fetch renewal zones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchZones();
  }, [enabled]);

  return { zones, isLoading };
}
