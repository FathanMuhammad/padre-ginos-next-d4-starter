import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/redirect";

describe("safeNext", () => {
  it("keeps paths on our own site", () => {
    expect(safeNext("/admin/orders?page=2")).toBe("/admin/orders?page=2");
  });

  it("rejects other sites and junk", () => {
    expect(safeNext("https://evil.example")).toBe("/");
    expect(safeNext("//evil.example")).toBe("/");
    expect(safeNext("/\\evil.example")).toBe("/");
    expect(safeNext(undefined)).toBe("/");
    expect(safeNext(["/a", "/b"])).toBe("/");
  });
});
