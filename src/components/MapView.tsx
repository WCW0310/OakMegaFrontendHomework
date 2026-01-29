import { useEffect, useRef, Fragment } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
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
  const defaultCenter: [number, number] = [25.0117, 121.4658];

  // 用來存儲每個 Marker 的 ref，以便打開/關閉 Popup
  const markerRefs = useRef<Record<number, LeafletMarker>>({});
  const userMarkerRef = useRef<LeafletMarker | null>(null); // 用戶位置 Marker 的 ref

  // 當 activeStop 改變時，打開對應的 Popup
  useEffect(() => {
    if (activeStop && markerRefs.current[activeStop.id]) {
      markerRefs.current[activeStop.id].openPopup();
    }
  }, [activeStop, popupRefresh]);

  // 當 showUserLocationPopup 改變時，打開用戶位置的 Popup
  useEffect(() => {
    if (showUserLocationPopup && userMarkerRef.current) {
      userMarkerRef.current.openPopup();
    }
  }, [showUserLocationPopup, popupRefresh]);

  // 紅色 Marker 圖標
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
    <div className="relative w-full h-2/3 md:h-full md:w-2/3 z-10">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 視角控制 */}
        {activeStop ? (
          <ChangeView
            center={[activeStop.latitude, activeStop.longitude]}
            zoom={16}
          />
        ) : userLocation ? (
          <ChangeView center={[userLocation.lat, userLocation.lng]} zoom={16} />
        ) : null}

        {/* 1. 使用者位置：同時顯示 Google & FB 頭像 */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={redMarkerIcon}
            ref={(el) => {
              if (el) userMarkerRef.current = el;
            }}
          >
            <Popup>
              <div className="flex flex-col items-center p-2 min-w-30">
                <p className="text-xs font-bold text-gray-500 mb-2">
                  當前使用者定位
                </p>

                <div className="flex gap-3 justify-center items-center">
                  {/* Google 頭像 */}
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

                  {/* Facebook 頭像 (綁定後顯示) */}
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

                <div className="mt-2 text-center">
                  <p className="text-sm font-bold text-gray-800">
                    {user.google?.name}
                  </p>
                  {user.facebook && (
                    <p className="text-[10px] text-blue-600 font-medium">
                      已成功綁定 Facebook
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 2. 都更案區塊 (Polygons & Markers) */}
        {zones.map((zone) => (
          <Fragment key={`zone-group-${zone.id}`}>
            <Polygon
              positions={zone.boundary}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#93c5fd",
                fillOpacity: 0.5,
              }}
            />
          </Fragment>
        ))}

        {/* 3. 附近的 TOD 站點 */}
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
