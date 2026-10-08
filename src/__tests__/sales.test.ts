import { describe, expect, it } from "vitest";
import { withWeekAverage } from "@/lib/sales";

const sale = (date: string, pizzaId: string, quantity: number) => ({
  date, pizzaId, name: pizzaId, category: "Classic", quantity, revenue: quantity * 10,
});

describe("withWeekAverage", () => {
  it("averages the same pizza over the 7 days up to each date", () => {
    const rows = withWeekAverage([
      sale("2015-01-01", "a", 7),
      sale("2015-01-03", "a", 14),
      sale("2015-01-08", "a", 7), // 2015-01-01 is 7 days back: outside the window
      sale("2015-01-03", "b", 70), // another pizza: never counted for "a"
    ]);
    expect(rows.map((r) => r.weekAverage)).toEqual([1, 3, 3, 10]);
  });

  it("keeps every row and its fields", () => {
    const input = [sale("2015-02-01", "a", 2)];
    expect(withWeekAverage(input)[0]).toMatchObject(input[0]);
  });
});
