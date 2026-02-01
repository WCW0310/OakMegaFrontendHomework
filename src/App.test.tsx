import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, type MockedFunction } from "vitest";
import App from "./App";
import { useSocialAuth } from "./hooks/useSocialAuth";

// Mock dependencies
vi.mock("./hooks/useSocialAuth");
vi.mock("./services/polygonsService", () => ({ getPolygons: vi.fn() }));
vi.mock("./services/nearbyLocationsService", () => ({
  getNearbyLocations: vi.fn(),
}));
vi.mock("./components/LoginStep", () => ({
  LoginStep: () => <div>Login Step</div>,
}));
vi.mock("./components/BindStep", () => ({
  BindStep: () => <div>Bind Step</div>,
}));
vi.mock("./components/sidebar", () => ({ Sidebar: () => <div>Sidebar</div> }));
vi.mock("./components/map", () => ({ MapView: () => <div>MapView</div> }));
vi.mock("./components/LoadingScreen", () => ({
  LoadingScreen: () => <div>Loading...</div>,
}));
vi.mock("./utils/leafletSetup", () => ({ fixLeafletIcon: vi.fn() }));

describe("App", () => {
  it("renders LoginStep when user is not logged in", () => {
    const mockUseSocialAuth = useSocialAuth as MockedFunction<
      typeof useSocialAuth
    >;
    mockUseSocialAuth.mockReturnValue({
      user: {},
      handleFBLogin: vi.fn(),
      handleLogout: vi.fn(),
      googleBtnRef: { current: null },
    });

    render(<App />);
    expect(screen.getByText("Login Step")).toBeInTheDocument();
  });

  it("renders BindStep when user has Google but not Facebook", () => {
    const mockUseSocialAuth = useSocialAuth as MockedFunction<
      typeof useSocialAuth
    >;
    mockUseSocialAuth.mockReturnValue({
      user: {
        google: { name: "Test", picture: "", email: "test@example.com" },
      },
      handleFBLogin: vi.fn(),
      handleLogout: vi.fn(),
      googleBtnRef: { current: null },
    });

    render(<App />);
    expect(screen.getByText("Bind Step")).toBeInTheDocument();
  });

  it("renders Main Dashboard (Sidebar + Map) when fully authenticated", async () => {
    const mockUseSocialAuth = useSocialAuth as MockedFunction<
      typeof useSocialAuth
    >;
    mockUseSocialAuth.mockReturnValue({
      user: {
        google: { name: "Test", picture: "", email: "test@example.com" },
        facebook: { name: "Test", picture: "", id: "123" },
      },
      handleFBLogin: vi.fn(),
      handleLogout: vi.fn(),
      googleBtnRef: { current: null },
    });

    // Mock successful data fetch to clear loading state
    const { getPolygons } = await import("./services/polygonsService");
    const mockGetPolygons = getPolygons as MockedFunction<typeof getPolygons>;
    mockGetPolygons.mockResolvedValue([]);

    const { getNearbyLocations } =
      await import("./services/nearbyLocationsService");
    const mockGetNearbyLocations = getNearbyLocations as MockedFunction<
      typeof getNearbyLocations
    >;
    mockGetNearbyLocations.mockResolvedValue([]);

    render(<App />);

    // Use findByText to wait for the loading state to resolve
    expect(await screen.findByText("Sidebar")).toBeInTheDocument();
    expect(await screen.findByText("MapView")).toBeInTheDocument();
  });
});
