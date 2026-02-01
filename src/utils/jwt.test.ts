import { describe, it, expect } from "vitest";
import { parseJwt } from "./jwt";

describe("parseJwt", () => {
  it("decodes a valid JWT token", () => {
    // Header: {"alg":"HS256","typ":"JWT"} -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    // Payload: {"sub":"1234567890","name":"John Doe","iat":1516239022} -> eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
    // Signature: SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const decoded = parseJwt(token);
    expect(decoded).toEqual({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
    });
  });

  it("decodes token with special characters (e.g. Chinese) in payload", () => {
    // Payload: {"name":"測試"} -> eyJuYW1lIjoi5ris6KmmIn0
    // Encode: btoa(unescape(encodeURIComponent('{"name":"測試"}'))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const token = "header.eyJuYW1lIjoi5ris6KmmIn0.signature";
    expect(parseJwt(token)).toEqual({ name: "測試" });
  });
});
