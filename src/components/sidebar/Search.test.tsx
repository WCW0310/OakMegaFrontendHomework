import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Search } from "./Search";

describe("Sidebar Search", () => {
  it("renders input with correct placeholder", () => {
    render(
      <Search
        searchQuery=""
        onSearchChange={vi.fn()}
        onClear={vi.fn()}
        totalStops={10}
        filteredCount={10}
      />,
    );
    expect(screen.getByPlaceholderText("搜尋地點名稱...")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing", () => {
    const handleChange = vi.fn();
    render(
      <Search
        searchQuery=""
        onSearchChange={handleChange}
        onClear={vi.fn()}
        totalStops={10}
        filteredCount={10}
      />,
    );
    const input = screen.getByPlaceholderText("搜尋地點名稱...");
    fireEvent.change(input, { target: { value: "Tucheng" } });
    expect(handleChange).toHaveBeenCalledWith("Tucheng");
  });

  it("shows clear button only when there is query", () => {
    const { rerender } = render(
      <Search
        searchQuery=""
        onSearchChange={vi.fn()}
        onClear={vi.fn()}
        totalStops={10}
        filteredCount={10}
      />,
    );
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    rerender(
      <Search
        searchQuery="test"
        onSearchChange={vi.fn()}
        onClear={vi.fn()}
        totalStops={10}
        filteredCount={10}
      />,
    );
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", () => {
    const handleClear = vi.fn();
    render(
      <Search
        searchQuery="test"
        onSearchChange={vi.fn()}
        onClear={handleClear}
        totalStops={10}
        filteredCount={10}
      />,
    );
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("displays result count badge", () => {
    render(
      <Search
        searchQuery=""
        onSearchChange={vi.fn()}
        onClear={vi.fn()}
        totalStops={15}
        filteredCount={15}
      />,
    );
    expect(screen.getByText("15筆")).toBeInTheDocument();
  });
});
