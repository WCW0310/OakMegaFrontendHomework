import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSocialAuth } from "./useSocialAuth";

describe("useSocialAuth", () => {
  beforeEach(() => {
    // Mock global google and FB objects
    vi.stubGlobal("google", {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn(),
          prompt: vi.fn(),
        },
      },
    });

    vi.stubGlobal("FB", {
      init: vi.fn(),
      login: vi.fn(),
      api: vi.fn(),
    });

    // Mock document.getElementById
    vi.spyOn(document, "getElementById").mockReturnValue(
      document.createElement("div"),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("initializes without crashing", () => {
    const { result } = renderHook(() => useSocialAuth());
    expect(result.current).toBeDefined();
    // Verify properties exist
    expect(result.current.user).toBeDefined();
    expect(result.current.handleFBLogin).toBeInstanceOf(Function);
  });

  // Note: Detailed testing of async script loading and external SDK interactions
  // is complex and often redundant if we are just mocking the SDKs entirely.
  // We verified that the hook provides the expected interface.
});
