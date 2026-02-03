import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BindStep } from "./BindStep";

const mockUser = {
  google: {
    name: "Test User",
    picture: "pic.jpg",
  },
};

describe("BindStep", () => {
  it("renders user greeting and avatar", () => {
    render(<BindStep user={mockUser} onFBLogin={vi.fn()} />);
    expect(screen.getByText("歡迎, Test User")).toBeInTheDocument();
    expect(screen.getByAltText("avatar")).toBeInTheDocument();
  });

  it("renders Facebook binding button", () => {
    render(<BindStep user={mockUser} onFBLogin={vi.fn()} />);
    expect(screen.getByText("綁定 Facebook 帳號")).toBeInTheDocument();
  });

  it("calls onFBLogin when button is clicked", () => {
    const handleLogin = vi.fn();
    render(<BindStep user={mockUser} onFBLogin={handleLogin} />);
    fireEvent.click(screen.getByText("綁定 Facebook 帳號"));
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });
  it("renders Guest Login button when onFBGuestLogin is provided", () => {
    render(
      <BindStep user={mockUser} onFBLogin={vi.fn()} onFBGuestLogin={vi.fn()} />,
    );
    expect(screen.getByText("跳過登入 (Guest Login)")).toBeInTheDocument();
  });

  it("calls onFBGuestLogin when Guest Login button is clicked", () => {
    const handleGuestLogin = vi.fn();
    render(
      <BindStep
        user={mockUser}
        onFBLogin={vi.fn()}
        onFBGuestLogin={handleGuestLogin}
      />,
    );
    fireEvent.click(screen.getByText("跳過登入 (Guest Login)"));
    expect(handleGuestLogin).toHaveBeenCalledTimes(1);
  });
});
