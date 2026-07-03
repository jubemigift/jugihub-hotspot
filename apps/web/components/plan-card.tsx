import { Check, ShieldCheck, Wifi } from "lucide-react";
import Link from "next/link";
import { formatNaira } from "../lib/api";

export interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description?: string | null;
    priceKobo: number;
    durationMinutes: number;
  };
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <article className="rounded-lg border border-white/14 bg-gradient-to-br from-white/14 to-white/6 p-5 shadow-glass">
      <div className="flex items-center justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-lime-300 text-ink">
          <Wifi className="h-6 w-6" />
        </div>
        <span className="rounded-md bg-white px-3 py-1 text-sm font-black text-ink">{Math.round(plan.durationMinutes / 60)}h</span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-white">{plan.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-white/70">{plan.description || "Fast hotspot access for your device."}</p>
      <p className="mt-5 text-5xl font-black text-white">{formatNaira(plan.priceKobo)}</p>
      <div className="mt-5 space-y-3 text-sm text-white/80">
        <p className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Unlimited browsing</p>
        <p className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Starts immediately after payment</p>
        <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Secure Paystack checkout</p>
      </div>
      <Link href={`/buy?planId=${plan.id}`} className="mt-6 flex h-12 items-center justify-center rounded-md bg-lime-300 px-4 text-sm font-black text-ink transition hover:bg-white">
        Buy with Paystack
      </Link>
    </article>
  );
}
