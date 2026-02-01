import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "./index";
import type { NearbyItem } from "../../types";

const mockUser = {
  google: { name: "Test User", email: "test@example.com", picture: "" },
};

const mockStops: NearbyItem[] = [
  {
    id: 1,
    stop_name: "Tucheng Station",
    name: "Blue Line",
    latitude: 25,
    longitude: 121,
    distance: 0.5,
    radius: 300,
    is_tod: 1,
  },
  {
    id: 2,
    stop_name: "Banqiao Station",
    name: "Blue Line",
    latitude: 25.01,
    longitude: 121.01,
    distance: 2.0,
    radius: 300,
    is_tod: 1,
  },
];

describe("Sidebar Integration", () => {
  it("renders all sub-components", () => {
    render(
      <Sidebar
        user={mockUser}
        nearbyStops={mockStops}
        activeStop={null}
        onStopClick={vi.fn()}
        userLocation={null}
        onGoToMyLocation={vi.fn()}
        onLogout={vi.fn()}
        isLocationDenied={false}
        locationSource="default"
      />,
    );

    expect(screen.getByText("附近的都更地點")).toBeInTheDocument(); // Header
    expect(screen.getByText("Hi,")).toBeInTheDocument(); // UserInfo
    expect(screen.getByPlaceholderText("搜尋地點名稱...")).toBeInTheDocument(); // Search
    expect(screen.getByText("🚇 Tucheng Station")).toBeInTheDocument(); // StopList
    expect(screen.getByText("🚪 登出系統")).toBeInTheDocument(); // Footer
  });

  it("filters stop list based on search query", () => {
    render(
      <Sidebar
        user={mockUser}
        nearbyStops={mockStops}
        activeStop={null}
        onStopClick={vi.fn()}
        userLocation={null}
        onGoToMyLocation={vi.fn()}
        onLogout={vi.fn()}
        isLocationDenied={false}
        locationSource="default"
      />,
    );

    // Initial state: 2 stops
    expect(screen.getByText("🚇 Tucheng Station")).toBeInTheDocument();
    expect(screen.getByText("🚇 Banqiao Station")).toBeInTheDocument();
    expect(screen.getByText("共 2 筆")).toBeInTheDocument();

    // Type "Tucheng"
    const input = screen.getByPlaceholderText("搜尋地點名稱...");
    fireEvent.change(input, { target: { value: "Tucheng" } });

    // Filtered state: 1 stop
    expect(screen.getByText("🚇 Tucheng Station")).toBeInTheDocument();
    expect(screen.queryByText("🚇 Banqiao Station")).not.toBeInTheDocument();
    expect(screen.getByText("共 1/2 筆")).toBeInTheDocument();
  });
});
