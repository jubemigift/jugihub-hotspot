"use client";

import { CreditCard, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "../../components/logo";
import { api } from "../../lib/api";

function BuyForm() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await api<{ authorizationUrl: string }>("/payments/start", {
      method: "POST",
      body: JSON.stringify({
        fullName: form.get("fullName"),
        phone: form.get("phone"),
        email: form.get("email") || undefined,
        planId: params.get("planId") || form.get("planId"),
        sessionId: params.get("sessionId") || undefined,
        gateway: "paystack"
      })
    });
    window.location.href = response.authorizationUrl;
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Logo />
        <div className="mt-10 glass rounded-lg p-5 shadow-glass sm:p-8">
          <div className="flex items-center gap-3">
            <UserRound className="h-7 w-7 text-aurora" />
            <h1 className="text-3xl font-black text-white">Buy Internet</h1>
          </div>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-white/80">
              Full Name
              <input name="fullName" required className="h-12 rounded-md border border-white/14 bg-white/10 px-4 text-white outline-none focus:border-aurora" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white/80">
              Phone Number
              <input name="phone" required className="h-12 rounded-md border border-white/14 bg-white/10 px-4 text-white outline-none focus:border-aurora" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-white/80">
              Email
              <input name="email" type="email" className="h-12 rounded-md border border-white/14 bg-white/10 px-4 text-white outline-none focus:border-aurora" />
            </label>
            {!params.get("planId") && (
              <label className="grid gap-2 text-sm font-semibold text-white/80">
                Plan ID
                <input name="planId" required className="h-12 rounded-md border border-white/14 bg-white/10 px-4 text-white outline-none focus:border-aurora" />
              </label>
            )}
            <div className="rounded-md border border-lime-300/40 bg-lime-300/10 px-4 py-3 text-sm font-semibold text-white">
              Secure checkout is handled by Paystack.
            </div>
            <button disabled={loading} className="mt-3 flex h-12 items-center justify-center gap-2 rounded-md bg-lime-300 px-5 font-black text-ink disabled:opacity-60">
              <CreditCard className="h-5 w-5" />
              {loading ? "Opening Paystack" : "Pay with Paystack"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-4 py-6 text-white">Loading...</main>}>
      <BuyForm />
    </Suspense>
  );
}
