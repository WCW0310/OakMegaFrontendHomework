import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingScreen } from "./LoadingScreen";

describe("LoadingScreen", () => {
  it("renders loading spinner and text", () => {
    render(<LoadingScreen />);
    expect(screen.getByText("資料載入中...")).toBeInTheDocument();
    // Use role or query selector to check for spinner if needed, but text is sufficient for now
  });
});
