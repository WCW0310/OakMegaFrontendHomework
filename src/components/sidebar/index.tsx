import { useState } from "react";
import type { UserProfile, NearbyItem } from "../../types";
import { Header } from "./Header";
import { LocationStatus } from "./LocationStatus";
import { Search } from "./Search";
import { StopList } from "./StopList";

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
      <div className="p-3 bg-blue-600 text-white shadow-md z-10 shrink-0">
        <Header user={user} onLogout={onLogout} />

        <LocationStatus
          isLocationDenied={isLocationDenied}
          locationSource={locationSource}
          onGoToMyLocation={onGoToMyLocation}
        />

        <Search
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          totalStops={nearbyStops.length}
          filteredCount={filteredStops.length}
        />
      </div>

      {/* --- List Section --- */}
      <StopList
        filteredStops={filteredStops}
        allStops={nearbyStops}
        activeStop={activeStop}
        onStopClick={onStopClick}
      />
    </div>
  );
}
