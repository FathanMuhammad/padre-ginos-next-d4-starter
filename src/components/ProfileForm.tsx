"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/(shop)/account/actions";
import type { Profile } from "@/lib/types";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  // React resets the form after the action: show what was typed again
  const value = (field: keyof Profile) => state?.values[field] ?? profile[field] ?? "";

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4" noValidate>
      <Field label="Nama" name="name" defaultValue={value("name")} error={state?.errors.name} />
      <Field
        label="Telepon"
        name="phone"
        defaultValue={value("phone")}
        error={state?.errors.phone}
        inputMode="tel"
      />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Alamat pengiriman</span>
        <textarea
          name="address"
          rows={3}
          defaultValue={value("address")}
          aria-invalid={state?.errors.address ? true : undefined}
          aria-describedby="address-error"
          className="rounded-lg border border-black/10 px-3 py-2 aria-invalid:border-red-500"
        />
        <span id="address-error" className="text-xs text-red-700">
          {state?.errors.address}
        </span>
      </label>
      {state?.errors.form && (
        <p role="alert" className="text-sm text-red-700">
          {state.errors.form}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-sm font-semibold text-emerald-700">
          Profil disimpan.
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50"
      >
        {isPending ? "Menyimpan…" : "Simpan profil"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  inputMode,
}: {
  label: string;
  name: string;
  defaultValue: string;
  error?: string;
  inputMode?: "tel";
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${name}-error`}
        className="rounded-lg border border-black/10 px-3 py-2 aria-invalid:border-red-500"
      />
      <span id={`${name}-error`} className="text-xs text-red-700">
        {error}
      </span>
    </label>
  );
}
