import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./Header";

const mockUser = {
  google: { name: "Test User", email: "test@example.com", picture: "" },
};

describe("Sidebar Header", () => {
  it("renders title correctly", () => {
    render(<Header user={mockUser} onLogout={vi.fn()} />);
    expect(screen.getByText("附近的都更地點")).toBeInTheDocument();
  });

  it("renders user name", () => {
    render(<Header user={mockUser} onLogout={vi.fn()} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("calls onLogout when logout button is clicked", () => {
    const handleLogout = vi.fn();
    render(<Header user={mockUser} onLogout={handleLogout} />);

    const logoutBtn = screen.getByTitle("登出");
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
