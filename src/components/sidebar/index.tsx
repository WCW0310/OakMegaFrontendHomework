import { useState } from "react";
import type { UserProfile, NearbyItem } from "../../types";
import { Header } from "./Header";
import { LocationStatus } from "./LocationStatus";
import { UserInfo } from "./UserInfo";
import { Search } from "./Search";
import { StopList } from "./StopList";
import { Footer } from "./Footer";

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
        <Header
          userLocation={userLocation}
          onGoToMyLocation={onGoToMyLocation}
          isLocationDenied={isLocationDenied}
        />

        <LocationStatus
          isLocationDenied={isLocationDenied}
          locationSource={locationSource}
        />

        <UserInfo
          user={user}
          totalStops={nearbyStops.length}
          filteredCount={filteredStops.length}
        />

        <Search
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* --- List Section --- */}
      <StopList
        filteredStops={filteredStops}
        allStops={nearbyStops}
        activeStop={activeStop}
        onStopClick={onStopClick}
      />

      {/* --- Footer Section --- */}
      <Footer onLogout={onLogout} />
    </div>
  );
}
