import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MapView } from "./index";

// Mock react-leaflet
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  useMap: vi.fn(),
}));

// Mock child components to verify composition primarily
vi.mock("./MapController", () => ({
  MapController: () => <div data-testid="map-controller" />,
}));
vi.mock("./UserMarker", () => ({
  UserMarker: () => <div data-testid="user-marker" />,
}));
vi.mock("./StopMarkers", () => ({
  StopMarkers: () => <div data-testid="stop-markers" />,
}));
vi.mock("./ZoneLayers", () => ({
  ZoneLayers: () => <div data-testid="zone-layers" />,
}));

describe("MapView Integration", () => {
  const defaultProps = {
    user: { google: { name: "Test User", picture: "", email: "" } },
    zones: [],
    userLocation: null,
    nearbyStops: [],
    activeStop: null,
    showUserLocationPopup: false,
    popupRefresh: 0,
  };

  it("renders all map components", () => {
    render(<MapView {...defaultProps} />);

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    expect(screen.getByTestId("map-controller")).toBeInTheDocument();
    expect(screen.getByTestId("user-marker")).toBeInTheDocument();
    expect(screen.getByTestId("zone-layers")).toBeInTheDocument();
    expect(screen.getByTestId("stop-markers")).toBeInTheDocument();
  });
});
