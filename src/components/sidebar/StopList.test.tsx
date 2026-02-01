import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StopList } from "./StopList";
import type { NearbyItem } from "../../types";

const mockStop: NearbyItem = {
  id: 1,
  stop_name: "Test Stop",
  name: "Test Line",
  latitude: 25,
  longitude: 121,
  distance: 0.5,
  radius: 300,
  is_tod: 1,
};

describe("StopList", () => {
  it("renders loading state when allStops is empty (initial load)", () => {
    render(
      <StopList
        filteredStops={[]}
        allStops={[]}
        activeStop={null}
        onStopClick={vi.fn()}
      />,
    );
    expect(screen.getByText("正在搜尋附近地點...")).toBeInTheDocument();
  });

  it("renders empty state when searching yields no results", () => {
    render(
      <StopList
        filteredStops={[]}
        allStops={[mockStop]} // Not empty
        activeStop={null}
        onStopClick={vi.fn()}
      />,
    );
    expect(screen.getByText("找不到符合的地點")).toBeInTheDocument();
  });

  it("renders stop list items", () => {
    render(
      <StopList
        filteredStops={[mockStop]}
        allStops={[mockStop]}
        activeStop={null}
        onStopClick={vi.fn()}
      />,
    );
    expect(screen.getByText("🚇 Test Stop")).toBeInTheDocument();
    expect(screen.getByText("0.5 km")).toBeInTheDocument();
  });

  it("calls onStopClick when an item is clicked", () => {
    const handleClick = vi.fn();
    render(
      <StopList
        filteredStops={[mockStop]}
        allStops={[mockStop]}
        activeStop={null}
        onStopClick={handleClick}
      />,
    );

    fireEvent.click(screen.getByText("🚇 Test Stop"));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockStop);
  });
});
