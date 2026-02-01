import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPolygons } from "./polygonsService";

describe("polygonsService", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
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

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getPolygons();

    expect(fetchMock).toHaveBeenCalled();
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
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    // Spy on console.error to suppress output during test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getPolygons();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("handles network errors", async () => {
    fetchMock.mockRejectedValue(new Error("Network Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getPolygons();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
