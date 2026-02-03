import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPolygons } from "./polygonsService";
import { fetchClient } from "./apiClient";

vi.mock("./apiClient", () => ({
  fetchClient: vi.fn(),
}));

describe("polygonsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and transforms polygons data successfully", async () => {
    const mockResponse = {
      result: {
        features: [
          { type: "Feature", properties: {}, geometry: {} },
          { type: "Feature", properties: {}, geometry: {} },
        ],
      },
    };

    vi.mocked(fetchClient).mockResolvedValue(mockResponse);

    const result = await getPolygons();

    expect(fetchClient).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 0,
      geoJsonData: mockResponse.result.features[0],
    });
    expect(result[1]).toEqual({
      id: 1,
      geoJsonData: mockResponse.result.features[1],
    });
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(fetchClient).mockRejectedValue(new Error("API Error"));

    // Spy on console.error to suppress output during test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getPolygons();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
