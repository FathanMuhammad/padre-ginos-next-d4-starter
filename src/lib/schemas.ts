import { z } from "zod";
import { ORDER_STATUSES } from "./orders";

// Validation = is this input well-formed? A schema says it once, on the
// server, instead of a pile of typeof / Number.isInteger checks.

export const orderStatusInput = z.object({
  orderId: z.coerce.number().int().positive(),
  status: z.enum(ORDER_STATUSES),
});

// Empty optional fields are stored as null, not ""
const emptyToNull = (value: string) => (value === "" ? null : value);

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(40, "Nama maksimal 40 karakter."),
  phone: z
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .refine((value) => value === "" || /^\+?\d{8,15}$/.test(value), {
      message: "Telepon 8–15 digit, boleh diawali +.",
    })
    .transform(emptyToNull),
  address: z
    .string()
    .trim()
    .max(200, "Alamat maksimal 200 karakter.")
    .transform(emptyToNull),
});
