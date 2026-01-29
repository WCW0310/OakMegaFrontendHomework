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
}

export function Sidebar({
  user,
  nearbyStops,
  activeStop,
  onStopClick,
  userLocation,
  onGoToMyLocation,
  onLogout,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStops = nearbyStops.filter(
    (stop) =>
      stop.stop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full md:h-full md:w-1/3 bg-white shadow-xl flex flex-col z-20">
      {/* 頂部 Header */}
      <div className="p-4 bg-blue-600 text-white shadow-md z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🚇 附近 TOD 站點列表
          </h2>
          {userLocation && (
            <button
              onClick={onGoToMyLocation}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
              title="前往我的位置"
            >
              📍 我的位置
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-blue-100">
            已登入：
            <span className="font-medium text-white">{user.google?.name}</span>
          </p>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full text-white">
            共 {filteredStops.length} / {nearbyStops.length} 筆
          </span>
        </div>

        {/* 搜尋框 */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="搜尋站點名稱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded bg-blue-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* 列表內容 (可捲動區域) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {filteredStops.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>
              {nearbyStops.length === 0
                ? "尚無附近站點或載入中..."
                : "找不到符合的站點"}
            </p>
          </div>
        ) : (
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
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    🚇 {stop.stop_name}
                  </h3>
                  <span className="inline-block mt-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {stop.name}
                  </span>
                </div>
              </div>

              <hr className="border-gray-100 my-2" />

              <div className="flex justify-between items-end text-sm text-gray-600">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    📏 距離:
                    <span className="font-mono text-green-700 font-semibold">
                      {stop.distance.toFixed(2)} km
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部登出按鈕 */}
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
