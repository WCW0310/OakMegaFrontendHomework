interface Props {
  isLocationDenied: boolean;
  locationSource: "user" | "default";
}

export function LocationStatus({ isLocationDenied, locationSource }: Props) {
  return (
    <>
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
            {locationSource === "user" ? "我的位置 (即時)" : "預設位置 (土城)"}
          </span>
        </span>
      </div>
    </>
  );
}
