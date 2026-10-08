import { describe, expect, it } from "vitest";
import { can } from "@/lib/permissions";
import { orderStatusInput } from "@/lib/schemas";

describe("can", () => {
  it("nobody signed in can do nothing", () => {
    expect(can(null, "admin:view")).toBe(false);
  });

  it("customers cannot touch the dashboard", () => {
    expect(can({ role: "customer" }, "admin:view")).toBe(false);
    expect(can({ role: "customer" }, "orders:update")).toBe(false);
  });

  it("staff and admins can update orders", () => {
    expect(can({ role: "staff" }, "orders:update")).toBe(true);
    expect(can({ role: "admin" }, "orders:update")).toBe(true);
  });
});

describe("products:manage", () => {
  it("is for admins only", () => {
    expect(can({ role: "admin" }, "products:manage")).toBe(true);
    expect(can({ role: "staff" }, "products:manage")).toBe(false);
    expect(can({ role: "customer" }, "products:manage")).toBe(false);
  });
});

describe("orderStatusInput", () => {
  it("accepts form strings and coerces the id", () => {
    const result = orderStatusInput.safeParse({ orderId: "21350", status: "ready" });
    expect(result.success && result.data).toEqual({ orderId: 21350, status: "ready" });
  });

  it("rejects unknown statuses and bad ids", () => {
    expect(orderStatusInput.safeParse({ orderId: "1", status: "teleported" }).success).toBe(false);
    expect(orderStatusInput.safeParse({ orderId: "abc", status: "ready" }).success).toBe(false);
    expect(orderStatusInput.safeParse({ orderId: null, status: "ready" }).success).toBe(false);
  });
});
