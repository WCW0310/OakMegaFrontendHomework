import { describe, it, expect, vi } from "vitest";
import { fixLeafletIcon } from "./leafletSetup";
import L from "leaflet";

// Mock Leaflet
vi.mock("leaflet", () => {
  const iconMock = vi.fn();
  return {
    default: {
      icon: iconMock,
      Marker: {
        prototype: {
          options: {},
        },
      },
    },
  };
});

describe("leafletSetup", () => {
  it("configures default marker icon", () => {
    fixLeafletIcon();
    expect(L.icon).toHaveBeenCalled();
    // Check if options were updated (conceptually)
    // Since we mocked L.Marker.prototype.options, we can check if it has the icon property assigned
    expect(L.Marker.prototype.options).toHaveProperty("icon");
  });
});
