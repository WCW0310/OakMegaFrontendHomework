import { describe, it, expect } from "vitest";
import { getFbExpiration } from "./url";

describe("getFbExpiration", () => {
  it("extracts ext parameter correctly", () => {
    const url = "https://example.com/picture?ext=1772717239";
    expect(getFbExpiration(url)).toBe(1772717239);
  });

  it("returns null if ext is missing", () => {
    const url = "https://example.com/picture";
    expect(getFbExpiration(url)).toBeNull();
  });

  it("returns null for invalid url", () => {
    const url = "not-a-url";
    expect(getFbExpiration(url)).toBeNull();
  });

  it("returns null for non-numeric ext", () => {
    const url = "https://example.com?ext=abc";
    expect(getFbExpiration(url)).toBeNaN(); // parseInt("abc") is NaN
  });
});
