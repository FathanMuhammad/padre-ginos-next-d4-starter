import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileForm from "@/components/ProfileForm";
import { requireUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

export const metadata: Metadata = { title: "Akun saya — Padre Gino's" };

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-lg">
      <h1 className="text-3xl font-black">Akun saya</h1>
      {/* The session is request data: the heading stays in the static shell */}
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-xl bg-stone-200" />}>
        <AccountDetails />
      </Suspense>
    </section>
  );
}

async function AccountDetails() {
  const user = await requireUser(); // not signed in → 401 page
  return (
    <>
      <p className="mt-1 text-sm text-ink/60">
        @{user.login} · {ROLE_LABELS[user.role]}
      </p>
      {/* Only the fields the form needs reach the client */}
      <ProfileForm profile={{ name: user.name, phone: user.phone, address: user.address }} />
    </>
  );
}
