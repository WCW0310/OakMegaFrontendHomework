import { renderHook, act } from "@testing-library/react";
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
    expect(result.current.handleFBGuestLogin).toBeInstanceOf(Function);
  });

  it("handleFBGuestLogin updates user state correctly", () => {
    const { result } = renderHook(() => useSocialAuth());

    // Trigger guest login
    // Note: Since set state is async, we often assume renderHook handles updates,
    // but without act() we might get warnings. However, React 18+ auto-batches.
    // For hook testing, usually we act(...) if using @testing-library/react-hooks,
    // but here we imported from @testing-library/react which includes it.
    // Actually, calling the function directly is fine.

    // We need to wrap state updates in act()
    act(() => {
      result.current.handleFBGuestLogin();
    });

    expect(result.current.user.isFBGuest).toBe(true);
    expect(result.current.user.facebook?.name).toBe("Guest User");
  });

  // Note: Detailed testing of async script loading and external SDK interactions
  // is complex and often redundant if we are just mocking the SDKs entirely.
  // We verified that the hook provides the expected interface.
});
