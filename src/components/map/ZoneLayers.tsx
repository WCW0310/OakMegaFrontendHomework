import { GeoJSON } from "react-leaflet";
import type { RenewalZone } from "../../types";

interface Props {
  zones: RenewalZone[];
}

export function ZoneLayers({ zones }: Props) {
  return (
    <>
      {zones.map((zone) => (
        <GeoJSON
          key={`zone-geojson-${zone.id}`}
          data={zone.geoJsonData}
          style={{
            color: "#3b82f6",
            fillColor: "#93c5fd",
            fillOpacity: 0.5,
            weight: 2,
          }}
        />
      ))}
    </>
  );
}
