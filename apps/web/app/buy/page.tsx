"use client";

import { CreditCard, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "../../components/logo";
import { api } from "../../lib/api";

export default function BuyPage() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState("paystack");

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
        gateway
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
            <div className="grid gap-2 text-sm font-semibold text-white/80">
              Gateway
              <div className="grid grid-cols-3 rounded-md border border-white/14 bg-white/8 p-1">
                {["paystack", "flutterwave", "monnify"].map((item) => (
                  <button key={item} type="button" onClick={() => setGateway(item)} className={`h-10 rounded-md text-xs font-bold capitalize ${gateway === item ? "bg-white text-ink" : "text-white/70"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button disabled={loading} className="mt-3 flex h-12 items-center justify-center gap-2 rounded-md bg-violet px-5 font-bold text-white disabled:opacity-60">
              <CreditCard className="h-5 w-5" />
              {loading ? "Opening Payment" : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
