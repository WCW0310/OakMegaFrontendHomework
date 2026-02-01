import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNearbyLocations } from "./nearbyLocationsService";

describe("nearbyLocationsService", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches nearby locations successfully", async () => {
    const mockData = [
      { id: 1, name: "Stop A" },
      { id: 2, name: "Stop B" },
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ result: mockData }),
    });

    const result = await getNearbyLocations(121, 25);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/server/xinbei/calc-distance"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ lng: 121, lat: 25 }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it("handles API errors gracefully", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getNearbyLocations(121, 25);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
