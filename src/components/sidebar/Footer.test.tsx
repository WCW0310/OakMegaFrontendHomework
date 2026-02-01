import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "./Footer";

describe("Sidebar Footer", () => {
  it("renders logout button", () => {
    render(<Footer onLogout={vi.fn()} />);
    expect(screen.getByText("🚪 登出系統")).toBeInTheDocument();
  });

  it("calls onLogout when clicked", () => {
    const handleLogout = vi.fn();
    render(<Footer onLogout={handleLogout} />);
    fireEvent.click(screen.getByText("🚪 登出系統"));
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
