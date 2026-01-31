import { useState, useEffect } from "react";
import { useSocialAuth } from "./hooks/useSocialAuth";
import { getPolygons } from "./services/polygonsService";
import { getNearbyLocations } from "./services/nearbyLocationsService";
import { LoginStep } from "./components/LoginStep";
import { BindStep } from "./components/BindStep";
import { Sidebar } from "./components/Sidebar";
import { MapView } from "./components/MapView";
import { LoadingScreen } from "./components/LoadingScreen";
import { fixLeafletIcon } from "./utils/leafletSetup";
import type { RenewalZone, NearbyItem } from "./types";

// 修正 Leaflet 圖示
fixLeafletIcon();

// Default fallback location (Tucheng MRT)
const DEFAULT_LOCATION = {
  lat: 24.9722,
  lng: 121.4442,
};

function App() {
  const { user, handleFBLogin, handleLogout } = useSocialAuth();

  // --- State Management ---

  // Data State
  const [zones, setZones] = useState<RenewalZone[]>([]);
  const [nearbyStops, setNearbyStops] = useState<NearbyItem[]>([]);
  const [isZonesLoading, setIsZonesLoading] = useState(false);

  // Location State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocationDenied, setIsLocationDenied] = useState(false);

  // UI State
  const [activeStop, setActiveStop] = useState<NearbyItem | null>(null);
  const [showUserLocationPopup, setShowUserLocationPopup] = useState(false);
  const [popupRefresh, setPopupRefresh] = useState(0);

  // Derived State: Determine active location source for UI feedback
  const locationSource = userLocation ? "user" : "default";
  const isAuthReady = !!(user.google && user.facebook);

  // --- Side Effects ---

  // 1. Mobile Viewport Height Fix (100vh)
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // 2. Fetch Renewal Zones (Static Data)
  useEffect(() => {
    if (!isAuthReady) return;

    const fetchZones = async () => {
      try {
        setIsZonesLoading(true);
        const data = await getPolygons();
        setZones(data);
      } catch (error) {
        console.error("Failed to fetch renewal zones:", error);
      } finally {
        setIsZonesLoading(false);
      }
    };
    fetchZones();
  }, [isAuthReady]);

  // 3. Request User Geolocation (Background with Robust Retry Logic)
  useEffect(() => {
    if (!isAuthReady || !("geolocation" in navigator)) return;

    const handleSuccess = (pos: GeolocationPosition) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setIsLocationDenied(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn(`Geolocation error (${err.code}): ${err.message}`);

      // Case 1: Permission Denied
      if (err.code === 1) {
        setIsLocationDenied(true);
        return;
      }

      // Case 2: Timeout or Unavailable -> Fallback to Low Accuracy
      if (err.code === 3 || err.code === 2) {
        console.log("High accuracy failed, retrying with low accuracy...");
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          (retryErr) =>
            console.error("Low accuracy also failed:", retryErr.message),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
        );
      }
    };

    // Initial Attempt: High Accuracy
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
    });
  }, [isAuthReady]);

  // 4. Fetch Nearby Stops (Race Condition Protected)
  // Updates whenever the user location changes or falls back to default.
  useEffect(() => {
    if (!isAuthReady) return;

    // ✅ Race Condition Fix: Track if this effect is still active
    let ignore = false;

    // Optional: Clear list immediately to avoid confusion during switch
    setNearbyStops([]);

    const targetLat = userLocation ? userLocation.lat : DEFAULT_LOCATION.lat;
    const targetLng = userLocation ? userLocation.lng : DEFAULT_LOCATION.lng;

    const fetchNearby = async () => {
      try {
        const data = await getNearbyLocations(targetLng, targetLat);

        // ✅ Only update state if this effect hasn't been cleaned up
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

    // ✅ Cleanup function: Mark this run as ignored when dependencies change
    return () => {
      ignore = true;
    };
  }, [isAuthReady, userLocation]);

  // --- Event Handlers ---

  const handleStopClick = (stop: NearbyItem) => {
    setActiveStop(stop);
    setShowUserLocationPopup(false);
    setPopupRefresh((prev) => prev + 1);
  };

  const handleGoToMyLocation = () => {
    // 1. Permission Check
    if (isLocationDenied) {
      alert(
        "⚠️ 無法取得位置權限\n\n您之前封鎖了位置存取。請點擊瀏覽器網址列左側的「鎖頭 🔒」或「設定」圖示，將位置權限設為「允許」，並重新整理網頁。",
      );
    }

    // 2. Navigation Action
    // Always trigger popup and fly-to behavior (MapView handles the target logic)
    setActiveStop(null);
    setShowUserLocationPopup(true);
    setPopupRefresh((prev) => prev + 1);

    // 3. Retry Logic
    // If location is missing but not explicitly denied, try fetching again
    if (!userLocation && !isLocationDenied) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLocationDenied(false);
        },
        (err) => {
          if (err.code === 1) setIsLocationDenied(true);
        },
      );
    }
  };

  // --- Render Flow ---

  if (!user.google) return <LoginStep />;
  if (!user.facebook) return <BindStep user={user} onFBLogin={handleFBLogin} />;

  if (isZonesLoading && zones.length === 0) {
    return <LoadingScreen message="正在載入地圖圖資..." />;
  }

  return (
    <div
      className="flex flex-col-reverse md:flex-row w-full overflow-hidden"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <Sidebar
        user={user}
        nearbyStops={nearbyStops}
        activeStop={activeStop}
        onStopClick={handleStopClick}
        userLocation={userLocation}
        onGoToMyLocation={handleGoToMyLocation}
        onLogout={handleLogout}
        isLocationDenied={isLocationDenied}
        locationSource={locationSource}
      />

      <MapView
        user={user}
        zones={zones}
        userLocation={userLocation}
        nearbyStops={nearbyStops}
        activeStop={activeStop}
        showUserLocationPopup={showUserLocationPopup}
        popupRefresh={popupRefresh}
      />
    </div>
  );
}

export default App;
