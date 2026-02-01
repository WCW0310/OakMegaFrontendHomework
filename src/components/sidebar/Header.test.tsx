import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./Header";

describe("Sidebar Header", () => {
  it("renders title correctly", () => {
    render(
      <Header
        userLocation={null}
        onGoToMyLocation={vi.fn()}
        isLocationDenied={false}
      />,
    );
    expect(screen.getByText("附近的都更地點")).toBeInTheDocument();
  });

  it("renders 'My Location' button when location is available", () => {
    render(
      <Header
        userLocation={{ lat: 25, lng: 121 }}
        onGoToMyLocation={vi.fn()}
        isLocationDenied={false}
      />,
    );
    const btn = screen.getByText("📍 我的位置");
    expect(btn).toBeInTheDocument();
    expect(btn.closest("button")).toHaveClass("bg-red-500");
  });

  it("renders warning button when location is denied", () => {
    render(
      <Header
        userLocation={null}
        onGoToMyLocation={vi.fn()}
        isLocationDenied={true}
      />,
    );
    const btn = screen.getByText("⚠️ 開啟定位");
    expect(btn).toBeInTheDocument();
    expect(btn.closest("button")).toHaveClass("bg-orange-500");
  });

  it("does not render button when no location and not denied (initial state)", () => {
    render(
      <Header
        userLocation={null}
        onGoToMyLocation={vi.fn()}
        isLocationDenied={false}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onGoToMyLocation when button is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Header
        userLocation={{ lat: 25, lng: 121 }}
        onGoToMyLocation={handleClick}
        isLocationDenied={false}
      />,
    );
    fireEvent.click(screen.getByText("📍 我的位置"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
