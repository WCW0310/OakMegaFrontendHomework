import { useState, useEffect } from "react";

// 1. 引入自定義 Hook (處理 Google/FB 登入邏輯)
import { useSocialAuth } from "./hooks/useSocialAuth";

// 2. 引入 API Services
import { getPolygons } from "./services/polygonsService";
import { getNearbyLocations } from "./services/nearbyLocationsService";

// 3. 引入工具
import { fixLeafletIcon } from "./utils/leafletSetup";

// 4. 引入型別
import type { RenewalZone, NearbyItem } from "./types";

// 5. 引入 UI 元件
import { LoginStep } from "./components/LoginStep";
import { BindStep } from "./components/BindStep";
import { Sidebar } from "./components/Sidebar";
import { MapView } from "./components/MapView";

// 修正 Leaflet 圖示
fixLeafletIcon();

function App() {
  // --- A. 自定義 Hook ---
  const { user, handleFBLogin, handleLogout } = useSocialAuth();

  // --- B. 狀態管理 ---
  const [zones, setZones] = useState<RenewalZone[]>([]);
  const [nearbyStops, setNearbyStops] = useState<NearbyItem[]>([]);
  const [activeStop, setActiveStop] = useState<NearbyItem | null>(null);
  const [showUserLocationPopup, setShowUserLocationPopup] = useState(false);
  const [popupRefresh, setPopupRefresh] = useState(0);

  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // --- C. Side Effects ---

  // 1. 取得使用者地理位置
  useEffect(() => {
    if (user.google && user.facebook && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("無法取得位置:", err),
        { enableHighAccuracy: true },
      );
    }
  }, [user.google, user.facebook]);

  // 2. 取得都更案資料 (Zones)
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const data = await getPolygons();
        setZones(data);
      } catch (error) {
        console.error("載入都更資料失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.google) {
      fetchZones();
    }
  }, [user.google]);

  // 3. 取得附近的 TOD 站點 (Nearby Stops)
  useEffect(() => {
    const fetchNearby = async () => {
      if (!userLocation) return;

      try {
        const data = await getNearbyLocations(
          userLocation.lng,
          userLocation.lat,
        );
        setNearbyStops(data);
        console.log("已取得附近站點:", data.length, "筆");
      } catch (error) {
        console.error("載入附近站點失敗:", error);
      }
    };

    fetchNearby();
  }, [userLocation]);

  // --- D. 事件處理 ---

  const handleStopClick = (stop: NearbyItem) => {
    setActiveStop(stop);
    setShowUserLocationPopup(false);
    setPopupRefresh((prev) => prev + 1);
  };

  const handleGoToMyLocation = () => {
    setActiveStop(null);
    setShowUserLocationPopup(true);
    setPopupRefresh((prev) => prev + 1);
  };

  // --- E. 渲染流程 ---

  if (!user.google) return <LoginStep />;
  if (!user.facebook) return <BindStep user={user} onFBLogin={handleFBLogin} />;

  if (loading && zones.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-xl font-bold text-gray-600 animate-pulse">
          資料載入中...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen md:h-screen w-full">
      {/* 下方列表 (手機) / 左側列表 (桌面) */}
      <Sidebar
        user={user}
        nearbyStops={nearbyStops}
        activeStop={activeStop}
        onStopClick={handleStopClick}
        userLocation={userLocation}
        onGoToMyLocation={handleGoToMyLocation}
        onLogout={handleLogout}
      />

      {/* 上方地圖 (手機) / 右側地圖 (桌面) */}
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
