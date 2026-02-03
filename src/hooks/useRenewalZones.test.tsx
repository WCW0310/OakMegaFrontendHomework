import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRenewalZones } from "./useRenewalZones";
import { getPolygons } from "../services/polygonsService";
import type { RenewalZone } from "../types";

vi.mock("../services/polygonsService", () => ({
  getPolygons: vi.fn(),
}));

describe("useRenewalZones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return empty array and not loading initially", () => {
    const { result } = renderHook(() => useRenewalZones(false));
    expect(result.current.zones).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should fetch zones when enabled", async () => {
    const mockData = [{ id: 1, geoJsonData: {} }] as unknown as RenewalZone[];
    vi.mocked(getPolygons).mockResolvedValue(mockData);

    const { result } = renderHook(() => useRenewalZones(true));

    // Initially loading should be true (or become true quickly)
    // But since it's async, we wait for the final state
    await waitFor(() => {
      expect(getPolygons).toHaveBeenCalled();
      expect(result.current.zones).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should handle error gracefully", async () => {
    vi.mocked(getPolygons).mockRejectedValue(new Error("API Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useRenewalZones(true));

    await waitFor(() => {
      expect(getPolygons).toHaveBeenCalled();
      expect(result.current.zones).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  it("should not fetch if disabled", () => {
    renderHook(() => useRenewalZones(false));
    expect(getPolygons).not.toHaveBeenCalled();
  });
});
