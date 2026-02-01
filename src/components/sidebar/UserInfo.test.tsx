import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserInfo } from "./UserInfo";

// Mock user data
const mockUser = {
  google: {
    name: "Test User",
    email: "test@example.com",
    picture: "https://example.com/pic.jpg",
  },
};

describe("UserInfo", () => {
  it("renders user name correctly", () => {
    render(<UserInfo user={mockUser} totalStops={10} filteredCount={10} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("shows '搜尋中...' when totalStops is 0", () => {
    render(<UserInfo user={mockUser} totalStops={0} filteredCount={0} />);
    expect(screen.getByText("搜尋中...")).toBeInTheDocument();
  });

  it("shows only total count when filtered count matches total", () => {
    render(<UserInfo user={mockUser} totalStops={5} filteredCount={5} />);
    expect(screen.getByText("共 5 筆")).toBeInTheDocument();
    expect(screen.queryByText(/5\/5/)).not.toBeInTheDocument();
  });

  it("shows detailed count when list is filtered", () => {
    render(<UserInfo user={mockUser} totalStops={10} filteredCount={3} />);
    expect(screen.getByText("共 3/10 筆")).toBeInTheDocument();
  });
});
