"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { PlanCard, PlanCardProps } from "./plan-card";

export function HomeExperience({ plans }: { plans: PlanCardProps["plan"][] }) {
  const firstPlan = plans[0];

  return (
    <main>
      <section className="min-h-[92vh] px-4 py-5 sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
          <a href="#plans" className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Plans
          </a>
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-10 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aurora">Premium hotspot access</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              JugiHub Internet
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              Fast, clean, automatic internet access. Choose a plan, pay securely, and your device starts browsing immediately.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={firstPlan ? `/buy?planId=${firstPlan.id}` : "/buy"} className="flex h-12 items-center justify-center rounded-md bg-violet px-6 font-bold text-white hover:bg-violet/90">
                Buy Internet
              </Link>
              <a href="#faq" className="flex h-12 items-center justify-center rounded-md border border-white/20 px-6 font-bold text-white hover:bg-white/10">
                FAQ
              </a>
            </div>
          </motion.div>

          <div className="glass rounded-lg p-5 shadow-glass">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                [Zap, "Instant activation", "No voucher typing after successful payment."],
                [Timer, "Exact expiry", "Daily plans end exactly 24 hours after payment."],
                [ShieldCheck, "Secure payments", "Gateway callbacks are verified before access is issued."]
              ].map(([Icon, title, copy]) => (
                <div key={String(title)} className="rounded-md bg-white/8 p-4">
                  <Icon className="h-6 w-6 text-aurora" />
                  <p className="mt-3 font-bold text-white">{String(title)}</p>
                  <p className="mt-1 text-sm leading-6 text-white/66">{String(copy)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-aurora">Internet plans</p>
              <h2 className="mt-2 text-3xl font-black text-white">Choose your access</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/68">Plans are managed from the admin dashboard, so pricing, duration, and bandwidth can change without code edits.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {[
            ["When does my plan start?", "Immediately after your payment is verified."],
            ["Do I need a voucher code?", "No. A voucher is generated for support records, but your device is logged in automatically."],
            ["Can I buy another plan later?", "Yes. Choose any active plan from this portal when your current access expires."],
            ["Need help?", "Call +234 000 000 0000 or email support@jugihub.com."]
          ].map(([title, copy]) => (
            <div key={title} className="border-t border-white/16 py-5">
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/54">
        Terms and conditions apply. JugiHub Internet provides prepaid hotspot access subject to network availability.
      </footer>
    </main>
  );
}
