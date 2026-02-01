import { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon, Marker as LeafletMarker } from "leaflet";
import type { UserProfile } from "../../types";

interface Props {
  user: UserProfile;
  userLocation: { lat: number; lng: number } | null;
  displayPosition: { lat: number; lng: number };
  showUserLocationPopup: boolean;
  popupRefresh: number;
}

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

export function UserMarker({
  user,
  userLocation,
  displayPosition,
  showUserLocationPopup,
  popupRefresh,
}: Props) {
  const userMarkerRef = useRef<LeafletMarker | null>(null);

  // Effect: Handle User Location Popup (from "My Location" button)
  useEffect(() => {
    if (showUserLocationPopup && userMarkerRef.current) {
      userMarkerRef.current.openPopup();
    }
  }, [showUserLocationPopup, popupRefresh]);

  return (
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
            {userLocation ? "您的目前位置" : "參考點 (預設)"}
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
                (未取得權限或確認中)
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
