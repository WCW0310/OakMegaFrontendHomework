import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { RenewalZone, UserProfile, NearbyItem } from "../../types";
import { MapController } from "./MapController";
import { UserMarker } from "./UserMarker";
import { StopMarkers } from "./StopMarkers";
import { ZoneLayers } from "./ZoneLayers";

interface Props {
  user: UserProfile;
  zones: RenewalZone[];
  userLocation: { lat: number; lng: number } | null;
  nearbyStops: NearbyItem[];
  activeStop: NearbyItem | null;
  showUserLocationPopup: boolean;
  popupRefresh: number;
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
        <MapController
          center={
            activeStop
              ? [activeStop.latitude, activeStop.longitude]
              : [displayPosition.lat, displayPosition.lng]
          }
          zoom={16}
        />

        {/* --- Layer 1: User / Reference Marker --- */}
        <UserMarker
          user={user}
          userLocation={userLocation}
          displayPosition={displayPosition}
          showUserLocationPopup={showUserLocationPopup}
          popupRefresh={popupRefresh}
        />

        {/* --- Layer 2: Renewal Zones (GeoJSON) --- */}
        <ZoneLayers zones={zones} />

        {/* --- Layer 3: Nearby Stops --- */}
        <StopMarkers
          nearbyStops={nearbyStops}
          activeStop={activeStop}
          popupRefresh={popupRefresh}
        />
      </MapContainer>
    </div>
  );
}
