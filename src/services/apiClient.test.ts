import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { fetchClient } from "./apiClient";

describe("fetchClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return data on successful request", async () => {
    const mockData = { success: true };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchClient("/test");
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/test", {});
  });

  it("should throw error on 4xx response without retrying", async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchClient("/test")).rejects.toThrow(
      "API Error: 404 Not Found",
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should retry on 5xx response", async () => {
    // Fail twice with 500, then succeed
    (fetch as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

    const result = await fetchClient("/test", { retries: 3, retryDelay: 10 });
    expect(result).toEqual({ data: "success" });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("should throw after max retries exceeded", async () => {
    (fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    await expect(
      fetchClient("/test", { retries: 2, retryDelay: 10 }),
    ).rejects.toThrow("Server Error: 500 Server Error");
    expect(fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });
});
