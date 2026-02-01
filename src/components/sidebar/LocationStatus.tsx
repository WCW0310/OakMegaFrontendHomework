interface Props {
  isLocationDenied: boolean;
  locationSource: "user" | "default";
  onGoToMyLocation: () => void;
}

export function LocationStatus({
  isLocationDenied,
  locationSource,
  onGoToMyLocation,
}: Props) {
  return (
    <>
      {/* Warning: Permission Denied */}
      {isLocationDenied && (
        <div className="mb-2 bg-orange-100 border-l-2 border-orange-500 text-orange-800 px-2 py-1 rounded text-[10px] flex items-center justify-between">
          <span className="font-bold">⚠️ 位置權限已封鎖 (顯示預設地點)</span>
        </div>
      )}

      {/* Status Bar: Source + Action */}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        {/* Source Indicator */}
        <div
          className={`px-2 py-1.5 rounded flex items-center gap-1.5 ${
            locationSource === "user"
              ? "bg-green-500/20 border border-green-300/30"
              : "bg-yellow-500/20 border border-yellow-300/30"
          }`}
        >
          <span className="text-xs">
            {locationSource === "user" ? "🎯" : "📍"}
          </span>
          <span className="text-[10px] leading-tight text-white/90">
            距離基準：
            <span className="font-bold ml-0.5">
              {locationSource === "user" ? "我的位置" : "預設 (土城)"}
            </span>
          </span>
        </div>

        {/* Location Action Button (Moved from Header) */}
        {!isLocationDenied && (
          <button
            onClick={onGoToMyLocation}
            className={`shrink-0 px-3 py-1.5 rounded text-[10px] font-bold transition-colors flex items-center gap-1 shadow-sm border border-white/20 ${
              locationSource === "user"
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
          >
            📍 我的位置
          </button>
        )}

        {/* Permission Action Button (Only if denied) */}
        {isLocationDenied && (
          <button
            onClick={onGoToMyLocation}
            className="shrink-0 px-3 py-1.5 rounded text-[10px] font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-sm"
          >
            ⚠️ 開啟定位
          </button>
        )}
      </div>
    </>
  );
}
