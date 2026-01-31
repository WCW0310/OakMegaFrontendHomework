import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { Icon, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

import type { RenewalZone, UserProfile, NearbyItem } from "../types";

interface Props {
  user: UserProfile;
  zones: RenewalZone[];
  userLocation: { lat: number; lng: number } | null;
  nearbyStops: NearbyItem[];
  activeStop: NearbyItem | null;
  showUserLocationPopup: boolean;
  popupRefresh: number;
}

// Helper component for programmatic map navigation
function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export function MapView({
  user,
  zones,
  userLocation,
  nearbyStops,
  activeStop,
  showUserLocationPopup,
  popupRefresh,
}: Props) {
  // Default Center: Tucheng MRT (Fallback)
  const defaultCenter: [number, number] = [24.9722, 121.4442];

  // Strategy: Display Marker Position
  // If user location is available, use it. Otherwise, use the default center as the "Reference Point".
  const displayPosition = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : { lat: defaultCenter[0], lng: defaultCenter[1] };

  // Leaflet Refs
  const markerRefs = useRef<Record<number, LeafletMarker>>({});
  const userMarkerRef = useRef<LeafletMarker | null>(null);

  // Effect: Handle Active Stop Popup (from Sidebar click)
  useEffect(() => {
    if (activeStop && markerRefs.current[activeStop.id]) {
      markerRefs.current[activeStop.id].openPopup();
    }
  }, [activeStop, popupRefresh]);

  // Effect: Handle User Location Popup (from "My Location" button)
  useEffect(() => {
    if (showUserLocationPopup && userMarkerRef.current) {
      userMarkerRef.current.openPopup();
    }
  }, [showUserLocationPopup, popupRefresh]);

  // Asset: Red Marker Icon for User/Reference Location
  const redMarkerIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="relative w-full h-1/2 md:h-full md:w-2/3 z-10 min-h-0 shrink-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* --- Map Controller --- */}
        {/* Priority: Active Stop > Display Position (User or Default) */}
        <ChangeView
          center={
            activeStop
              ? [activeStop.latitude, activeStop.longitude]
              : [displayPosition.lat, displayPosition.lng]
          }
          zoom={16}
        />

        {/* --- Layer 1: User / Reference Marker --- */}
        <Marker
          position={[displayPosition.lat, displayPosition.lng]}
          icon={redMarkerIcon}
          ref={(el) => {
            if (el) userMarkerRef.current = el;
          }}
        >
          <Popup>
            <div className="flex flex-col items-center p-2 min-w-30">
              {/* Dynamic Title */}
              <p className="text-xs font-bold text-gray-500 mb-2">
                {userLocation
                  ? "Current User Location"
                  : "Reference Point (Default)"}
              </p>

              {/* Avatars */}
              <div className="flex gap-3 justify-center items-center">
                <div className="relative">
                  <img
                    src={user.google?.picture}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    alt="Google User"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] shadow font-bold text-red-500">
                    G
                  </span>
                </div>

                {user.facebook && (
                  <div className="relative">
                    <img
                      src={user.facebook.picture}
                      className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md"
                      alt="FB User"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[10px] text-white shadow font-bold">
                      f
                    </span>
                  </div>
                )}
              </div>

              {/* User Info & Status */}
              <div className="mt-2 text-center">
                <p className="text-sm font-bold text-gray-800">
                  {user.google?.name}
                </p>
                {!userLocation && (
                  <p className="text-[10px] text-orange-500 mt-1">
                    (Permission denied or pending)
                  </p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* --- Layer 2: Renewal Zones (GeoJSON) --- */}
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

        {/* --- Layer 3: Nearby Stops --- */}
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
      </MapContainer>
    </div>
  );
}
