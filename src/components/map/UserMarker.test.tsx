import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserMarker } from "./UserMarker";

// Mock react-leaflet
vi.mock("react-leaflet", () => ({
  Marker: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: [number, number];
  }) => (
    <div data-testid="marker" data-lat={position[0]} data-lng={position[1]}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

const mockUser = {
  google: { name: "Test User", picture: "pic.jpg", email: "test@example.com" },
};

describe("UserMarker", () => {
  it("renders marker at display position", () => {
    render(
      <UserMarker
        user={mockUser}
        userLocation={null}
        displayPosition={{ lat: 20, lng: 120 }}
        showUserLocationPopup={false}
        popupRefresh={0}
      />,
    );
    const marker = screen.getByTestId("marker");
    expect(marker).toHaveAttribute("data-lat", "20");
    expect(marker).toHaveAttribute("data-lng", "120");
  });

  it("renders popup content correctly (default location)", () => {
    render(
      <UserMarker
        user={mockUser}
        userLocation={null} // No User Location
        displayPosition={{ lat: 20, lng: 120 }}
        showUserLocationPopup={true}
        popupRefresh={0}
      />,
    );
    expect(screen.getByText("參考點 (預設)")).toBeInTheDocument();
    expect(screen.getByText("(未取得權限或確認中)")).toBeInTheDocument();
  });

  it("renders popup content correctly (user location)", () => {
    render(
      <UserMarker
        user={mockUser}
        userLocation={{ lat: 25, lng: 121 }}
        displayPosition={{ lat: 25, lng: 121 }}
        showUserLocationPopup={true}
        popupRefresh={0}
      />,
    );
    expect(screen.getByText("您的目前位置")).toBeInTheDocument();
    expect(screen.queryByText("(未取得權限或確認中)")).not.toBeInTheDocument();
  });
});
