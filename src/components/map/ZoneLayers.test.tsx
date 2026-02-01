import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ZoneLayers } from "./ZoneLayers";
import type { RenewalZone } from "../../types";
import type { FeatureCollection, GeoJsonObject } from "geojson";

// Mock react-leaflet
vi.mock("react-leaflet", () => ({
  GeoJSON: ({ data }: { data: GeoJsonObject }) => (
    <div data-testid="geojson-layer" data-feature-type={data.type} />
  ),
}));

const mockGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const mockZones: RenewalZone[] = [
  { id: 101, geoJsonData: mockGeoJson },
  { id: 102, geoJsonData: mockGeoJson },
];

describe("ZoneLayers", () => {
  it("renders correct number of GeoJSON layers", () => {
    render(<ZoneLayers zones={mockZones} />);
    const layers = screen.getAllByTestId("geojson-layer");
    expect(layers).toHaveLength(2);
  });
});
