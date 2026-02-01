import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StopMarkers } from "./StopMarkers";
import type { NearbyItem } from "../../types";
import React from "react"; // Added this import for React.ReactNode

// Mock react-leaflet
vi.mock("react-leaflet", () => ({
  Marker: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: [number, number];
  }) => (
    <div
      data-testid="stop-marker"
      data-lat={position[0]}
      data-lng={position[1]}
    >
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

const mockStops: NearbyItem[] = [
  {
    id: 1,
    stop_name: "Stop A",
    name: "Line A",
    latitude: 10,
    longitude: 20,
    distance: 0.5,
    radius: 300,
    is_tod: 1,
  },
  {
    id: 2,
    stop_name: "Stop B",
    name: "Line B",
    latitude: 30,
    longitude: 40,
    distance: 1.2,
    radius: 300,
    is_tod: 1,
  },
];

describe("StopMarkers", () => {
  it("renders correct number of markers", () => {
    render(
      <StopMarkers
        nearbyStops={mockStops}
        activeStop={null}
        popupRefresh={0}
      />,
    );
    const markers = screen.getAllByTestId("stop-marker");
    expect(markers).toHaveLength(2);
  });

  it("passes correct position to markers", () => {
    render(
      <StopMarkers
        nearbyStops={mockStops}
        activeStop={null}
        popupRefresh={0}
      />,
    );
    const markers = screen.getAllByTestId("stop-marker");
    expect(markers[0]).toHaveAttribute("data-lat", "10");
    expect(markers[0]).toHaveAttribute("data-lng", "20");
    expect(markers[1]).toHaveAttribute("data-lat", "30");
    expect(markers[1]).toHaveAttribute("data-lng", "40");
  });

  it("renders popup content correctly", () => {
    render(
      <StopMarkers
        nearbyStops={[mockStops[0]]}
        activeStop={null}
        popupRefresh={0}
      />,
    );
    expect(screen.getByText("🚇 Stop A")).toBeInTheDocument();
    expect(screen.getByText("Line A")).toBeInTheDocument();
    expect(screen.getByText("距離: 0.5 km")).toBeInTheDocument();
  });
});
