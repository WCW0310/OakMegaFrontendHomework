import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNearbyLocations } from "./nearbyLocationsService";
import { fetchClient } from "./apiClient";

vi.mock("./apiClient", () => ({
  fetchClient: vi.fn(),
}));

describe("nearbyLocationsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches nearby locations successfully", async () => {
    const mockData = [
      { id: 1, name: "Stop A" },
      { id: 2, name: "Stop B" },
    ];

    vi.mocked(fetchClient).mockResolvedValue({ result: mockData });

    const result = await getNearbyLocations(121, 25);

    expect(fetchClient).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/server/xinbei/calc-distance"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ lng: 121, lat: 25 }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(fetchClient).mockRejectedValue(new Error("API Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getNearbyLocations(121, 25);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
