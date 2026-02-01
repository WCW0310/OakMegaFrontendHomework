interface Props {
  userLocation: { lat: number; lng: number } | null;
  onGoToMyLocation: () => void;
  isLocationDenied: boolean;
}

export function Header({
  userLocation,
  onGoToMyLocation,
  isLocationDenied,
}: Props) {
  return (
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
  );
}
