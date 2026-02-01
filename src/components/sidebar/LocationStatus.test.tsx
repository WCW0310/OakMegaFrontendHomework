import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LocationStatus } from "./LocationStatus";

describe("LocationStatus", () => {
  it("renders permission denied warning when isLocationDenied is true", () => {
    render(
      <LocationStatus
        isLocationDenied={true}
        locationSource="default"
        onGoToMyLocation={vi.fn()}
      />,
    );
    expect(
      screen.getByText("⚠️ 位置權限已封鎖 (顯示預設地點)"),
    ).toBeInTheDocument();
  });

  it("does not render warning when permission is granted", () => {
    render(
      <LocationStatus
        isLocationDenied={false}
        locationSource="user"
        onGoToMyLocation={vi.fn()}
      />,
    );
    expect(screen.queryByText("⚠️ 位置權限已封鎖")).not.toBeInTheDocument();
  });

  it("shows 'My Location' indicator when source is user", () => {
    render(
      <LocationStatus
        isLocationDenied={false}
        locationSource="user"
        onGoToMyLocation={vi.fn()}
      />,
    );
    expect(screen.getByText("我的位置")).toBeInTheDocument();
    expect(screen.getByText("🎯")).toBeInTheDocument();
  });

  it("shows 'Default Location' indicator when source is default", () => {
    render(
      <LocationStatus
        isLocationDenied={true}
        locationSource="default"
        onGoToMyLocation={vi.fn()}
      />,
    );
    expect(screen.getByText("預設 (土城)")).toBeInTheDocument();
    expect(screen.getByText("📍")).toBeInTheDocument();
  });
});
