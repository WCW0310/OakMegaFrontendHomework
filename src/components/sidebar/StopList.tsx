import type { NearbyItem } from "../../types";

interface Props {
  filteredStops: NearbyItem[];
  allStops: NearbyItem[];
  activeStop: NearbyItem | null;
  onStopClick: (stop: NearbyItem) => void;
}

export function StopList({
  filteredStops,
  allStops,
  activeStop,
  onStopClick,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
      {filteredStops.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          {allStops.length === 0 ? (
            // Loading State (Empty source usually means fetching)
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              <p>正在搜尋附近地點...</p>
            </div>
          ) : (
            // Empty Search Result
            <p>找不到符合的地點</p>
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
                  {stop.distance} km
                </span>
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
