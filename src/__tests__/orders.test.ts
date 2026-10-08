import { describe, expect, test } from "vitest";
import { canTransition, isOrderStatus, nextStatuses } from "@/lib/orders";

describe("order workflow", () => {
  test("moves forward one step at a time", () => {
    expect(canTransition("pending", "preparing")).toBe(true);
    expect(canTransition("preparing", "ready")).toBe(true);
    expect(canTransition("ready", "delivered")).toBe(true);
    expect(canTransition("pending", "delivered")).toBe(false);
    expect(canTransition("ready", "pending")).toBe(false);
  });
  test("can be cancelled until it is ready", () => {
    expect(canTransition("pending", "cancelled")).toBe(true);
    expect(canTransition("preparing", "cancelled")).toBe(true);
    expect(canTransition("ready", "cancelled")).toBe(false);
  });
  test("final statuses have no next step", () => {
    expect(nextStatuses("delivered")).toEqual([]);
    expect(nextStatuses("cancelled")).toEqual([]);
  });
  test("recognises valid statuses only", () => {
    expect(isOrderStatus("ready")).toBe(true);
    expect(isOrderStatus("shipped")).toBe(false);
    expect(isOrderStatus(3)).toBe(false);
  });
});
