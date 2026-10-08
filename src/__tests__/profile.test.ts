import { describe, expect, it } from "vitest";
import { profileSchema } from "@/lib/schemas";

describe("profileSchema", () => {
  it("trims, and stores empty optional fields as null", () => {
    expect(profileSchema.parse({ name: "  Citra  ", phone: "", address: "  " })).toEqual({
      name: "Citra",
      phone: null,
      address: null,
    });
  });

  it("accepts phone numbers with spaces and a leading +", () => {
    expect(
      profileSchema.parse({ name: "Citra", phone: "+62 812 3456 7890", address: "" }).phone,
    ).toBe("+6281234567890");
  });

  it("rejects bad input with a message per field", () => {
    const result = profileSchema.safeParse({ name: "C", phone: "12ab", address: "x".repeat(201) });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((issue) => issue.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["name", "phone", "address"]));
  });

  it("drops fields it does not know about", () => {
    const parsed = profileSchema.parse({ name: "Citra", phone: "", address: "", role: "admin" });
    expect(parsed).not.toHaveProperty("role");
  });
});
