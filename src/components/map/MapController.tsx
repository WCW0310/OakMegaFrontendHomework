import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Props {
  center: [number, number];
  zoom?: number;
}

export function MapController({ center, zoom }: Props) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15, { duration: 1.5 });
    }
  }, [center, zoom, map]);

  return null;
}
