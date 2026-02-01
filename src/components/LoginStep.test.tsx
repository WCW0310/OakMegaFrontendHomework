import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoginStep } from "./LoginStep";

describe("LoginStep", () => {
  it("renders welcome title", () => {
    render(
      <LoginStep googleBtnRef={{ current: document.createElement("div") }} />,
    );
    expect(screen.getByText("新北市都更查詢系統")).toBeInTheDocument();
  });

  it("renders google login container", () => {
    // We can't easily query by ref, but we can verify the container structure
    const { container } = render(
      <LoginStep googleBtnRef={{ current: document.createElement("div") }} />,
    );
    // Check if there is a div that is supposed to hold the button (it has specific class)
    expect(container.querySelector(".h-11")).toBeInTheDocument();
  });
});
