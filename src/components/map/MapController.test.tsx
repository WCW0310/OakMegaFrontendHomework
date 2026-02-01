import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MapController } from "./MapController";

// Mock flyTo function
const flyToMock = vi.fn();

// Mock react-leaflet
vi.mock("react-leaflet", () => ({
  useMap: () => ({
    flyTo: flyToMock,
  }),
}));

describe("MapController", () => {
  it("calls map.flyTo when center changes", () => {
    const center: [number, number] = [25.0, 121.0];
    const zoom = 14;

    render(<MapController center={center} zoom={zoom} />);

    expect(flyToMock).toHaveBeenCalledWith(center, zoom, { duration: 1.5 });
  });

  it("uses default zoom if not provided", () => {
    const center: [number, number] = [24.0, 120.0];

    render(<MapController center={center} />);

    expect(flyToMock).toHaveBeenCalledWith(center, 15, { duration: 1.5 });
  });
});
