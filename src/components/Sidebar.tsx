import { useState } from "react";
import type { UserProfile, NearbyItem } from "../types";

interface Props {
  user: UserProfile;
  nearbyStops: NearbyItem[];
  activeStop: NearbyItem | null;
  onStopClick: (stop: NearbyItem) => void;
  userLocation: { lat: number; lng: number } | null;
  onGoToMyLocation: () => void;
  onLogout: () => void;
  isLocationDenied: boolean;
  locationSource: "user" | "default";
}

export function Sidebar({
  user,
  nearbyStops,
  activeStop,
  onStopClick,
  userLocation,
  onGoToMyLocation,
  onLogout,
  isLocationDenied,
  locationSource,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStops = nearbyStops.filter(
    (stop) =>
      stop.stop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-1/2 md:h-full md:w-1/3 bg-white shadow-xl flex flex-col z-20 min-h-0 shrink-0">
      {/* --- Header Section --- */}
      <div className="p-4 bg-blue-600 text-white shadow-md z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🚇 附近 TOD 站點
          </h2>

          {/* Location Action Button */}
          {(userLocation || isLocationDenied) && (
            <button
              onClick={onGoToMyLocation}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                isLocationDenied
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isLocationDenied ? "⚠️ 開啟定位" : "📍 我的位置"}
            </button>
          )}
        </div>

        {/* Warning: Permission Denied */}
        {isLocationDenied && (
          <div className="mb-3 bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-2 rounded text-xs">
            <p className="font-bold">⚠️ 位置權限已封鎖</p>
            <p>目前顯示預設地點。請至瀏覽器設定開啟權限。</p>
          </div>
        )}

        {/* Status Indicator: Location Source (Resolves user ambiguity) */}
        <div
          className={`mt-2 p-2 rounded text-xs flex items-center gap-2 ${
            locationSource === "user"
              ? "bg-green-500/20 border border-green-300/30"
              : "bg-yellow-500/20 border border-yellow-300/30"
          }`}
        >
          <span>{locationSource === "user" ? "🎯" : "📍"}</span>
          <span>
            距離計算基準：
            <span className="font-bold ml-1">
              {locationSource === "user"
                ? "我的位置 (即時)"
                : "預設位置 (土城)"}
            </span>
          </span>
        </div>

        {/* User Info & Count */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-blue-100">
            Hi,{" "}
            <span className="font-medium text-white">{user.google?.name}</span>
          </p>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full text-white">
            {nearbyStops.length === 0
              ? "搜尋中..."
              : `共 ${filteredStops.length} 筆`}
          </span>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="搜尋站點名稱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded bg-blue-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* --- List Section --- */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {filteredStops.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            {nearbyStops.length === 0 ? (
              // Loading State (Empty source usually means fetching)
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                <p>正在搜尋附近站點...</p>
              </div>
            ) : (
              // Empty Search Result
              <p>找不到符合的站點</p>
            )}
          </div>
        ) : (
          // Stop Items
          filteredStops.map((stop) => (
            <div
              key={stop.id}
              onClick={() => onStopClick(stop)}
              className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                activeStop?.id === stop.id
                  ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  🚇 {stop.stop_name}
                </h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {stop.name}
                </span>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="flex justify-between items-end text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  📏 距離:
                  <span className="font-mono text-green-700 font-semibold">
                    {stop.distance.toFixed(2)} km
                  </span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Footer Section --- */}
      <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-all font-bold border border-gray-200 hover:border-red-200"
        >
          🚪 登出系統
        </button>
      </div>
    </div>
  );
}
