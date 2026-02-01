import { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { Marker as LeafletMarker } from "leaflet";
import type { NearbyItem } from "../../types";

interface Props {
  nearbyStops: NearbyItem[];
  activeStop: NearbyItem | null;
  popupRefresh: number;
}

export function StopMarkers({ nearbyStops, activeStop, popupRefresh }: Props) {
  const markerRefs = useRef<Record<number, LeafletMarker>>({});

  // Effect: Handle Active Stop Popup (from Sidebar click)
  useEffect(() => {
    if (activeStop && markerRefs.current[activeStop.id]) {
      markerRefs.current[activeStop.id].openPopup();
    }
  }, [activeStop, popupRefresh]);

  return (
    <>
      {nearbyStops.map((stop) => (
        <Marker
          key={`stop-${stop.id}`}
          position={[stop.latitude, stop.longitude]}
          opacity={0.8}
          ref={(el) => {
            if (el) markerRefs.current[stop.id] = el;
          }}
        >
          <Popup>
            <div className="text-center">
              <p className="text-sm font-bold text-green-700">
                🚇 {stop.stop_name}
              </p>
              <p className="text-xs text-gray-600">{stop.name}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                距離: {stop.distance} km
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
