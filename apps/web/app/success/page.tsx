"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const autoLoginUrl = params.get("autoLoginUrl");
  const voucher = params.get("voucher");

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="glass w-full max-w-lg rounded-lg p-6 text-center shadow-glass">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-5 text-3xl font-black text-white">Payment Successful</h1>
        <p className="mt-3 text-sm leading-6 text-white/68">Your internet access has been activated. Keep your voucher for support.</p>
        {voucher && <p className="mt-5 rounded-md bg-white/10 px-4 py-3 font-mono text-sm text-white">{voucher}</p>}
        {autoLoginUrl && (
          <a href={autoLoginUrl} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-md bg-violet px-5 font-bold text-white">
            Start Browsing <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center px-4 text-white">Loading...</main>}>
      <SuccessContent />
    </Suspense>
  );
}
