"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { shouldFail, simulateLatency } from "@/lib/demo";
import { profileSchema } from "@/lib/schemas";
import type { Profile } from "@/lib/types";
import { updateProfile } from "@/lib/users";

type Field = keyof Profile; // "name" | "phone" | "address"

export type ProfileFormState = {
  ok: boolean;
  errors: Partial<Record<Field | "form", string>>;
  // What the user typed, so the form can show it again after an error
  values: Record<Field, string>;
} | null;

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  // 1. Who? From the session cookie. Never from a form field.
  const user = await requireUser();

  // 2. Well-formed? Read ONLY the fields we expect, then validate them.
  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
  };
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      ok: false,
      errors: {
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        address: fieldErrors.address?.[0],
      },
      values,
    };
  }

  await simulateLatency("write");
  if (await shouldFail()) {
    return { ok: false, errors: { form: "Gagal menyimpan. Coba lagi." }, values };
  }

  // 3. Save: the SESSION's user, with ONLY the validated fields.
  //    (P3 fix: no userId from the form, no spreading formData into the update)
  await updateProfile(user.id, parsed.data);
  // The header shows the name: re-render with fresh data
  refresh();
  return { ok: true, errors: {}, values };
}
