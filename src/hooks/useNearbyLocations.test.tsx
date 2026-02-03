import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useNearbyLocations } from "./useNearbyLocations";
import { getNearbyLocations } from "../services/nearbyLocationsService";
import type { NearbyItem } from "../types";

vi.mock("../services/nearbyLocationsService", () => ({
  getNearbyLocations: vi.fn(),
}));

describe("useNearbyLocations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return empty array initially", () => {
    const { result } = renderHook(() => useNearbyLocations(false, null));
    expect(result.current.nearbyStops).toEqual([]);
  });

  it("should fetch nearby locations when enabled", async () => {
    const mockData: NearbyItem[] = [
      {
        id: 1,
        name: "Stop A",
        stop_name: "Stop A",
        longitude: 121,
        latitude: 25,
        radius: 0,
        is_tod: 0,
        distance: 0,
      },
    ];
    vi.mocked(getNearbyLocations).mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useNearbyLocations(true, { lat: 25, lng: 121 }),
    );

    await waitFor(() => {
      expect(getNearbyLocations).toHaveBeenCalledWith(121, 25);
      expect(result.current.nearbyStops).toEqual(mockData);
    });
  });

  it("should use default location if user location is null", async () => {
    vi.mocked(getNearbyLocations).mockResolvedValue([]);
    renderHook(() => useNearbyLocations(true, null));

    await waitFor(() => {
      // Default location: lng: 121.4442, lat: 24.9722
      expect(getNearbyLocations).toHaveBeenCalledWith(121.4442, 24.9722);
    });
  });

  it("should not fetch if disabled", () => {
    renderHook(() => useNearbyLocations(false, null));
    expect(getNearbyLocations).not.toHaveBeenCalled();
  });
});
