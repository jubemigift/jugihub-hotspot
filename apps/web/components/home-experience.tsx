"use client";

import { motion } from "framer-motion";
import { Headphones, PhoneCall, Router, ShieldCheck, Timer, Wifi, Zap } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { PlanCard, PlanCardProps } from "./plan-card";
import { formatNaira } from "../lib/api";

export function HomeExperience({ plans }: { plans: PlanCardProps["plan"][] }) {
  const firstPlan = plans[0];

  return (
    <main>
      <section className="relative overflow-hidden px-4 py-5 sm:px-6 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(132,204,22,0.22),transparent_20rem)]" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <a href="#plans" className="hidden rounded-md px-3 py-2 text-sm font-semibold text-white/78 hover:text-white sm:block">Plans</a>
            <a href="#support" className="rounded-md bg-white px-4 py-2 text-sm font-black text-ink hover:bg-lime-300">Support</a>
          </div>
        </nav>

        <div className="mx-auto grid min-h-[76vh] max-w-6xl items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-lime-300">Premium hotspot internet</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">Fast WiFi access that starts immediately.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              Buy once, connect instantly. JugiHub Internet gives customers secure Paystack payment, automatic hotspot login, and exact plan expiry without voucher typing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={firstPlan ? `/buy?planId=${firstPlan.id}` : "/buy"} className="flex h-12 items-center justify-center rounded-md bg-lime-300 px-6 font-black text-ink hover:bg-white">
                Buy Internet Now
              </Link>
              <a href="tel:09013160626" className="flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-6 font-bold text-white hover:bg-white/10">
                <PhoneCall className="h-4 w-4" /> 09013160626
              </a>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-lime-300/30" />
            <div className="glass relative rounded-lg p-6 shadow-glass">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/58">Featured plan</p>
              <div className="mt-5 flex items-end gap-3">
                <p className="text-7xl font-black leading-none text-white">{firstPlan ? formatNaira(firstPlan.priceKobo).replace(".00", "") : "₦300"}</p>
                <p className="pb-2 text-sm font-bold text-lime-300">/ 24 hours</p>
              </div>
              <p className="mt-4 text-xl font-bold text-white">{firstPlan?.name || "Daily Plan"}</p>
              <p className="mt-2 text-sm leading-6 text-white/68">Unlimited browsing, automatic login, secure payment, and exact 24-hour expiry.</p>
              <Link href={firstPlan ? `/buy?planId=${firstPlan.id}` : "/buy"} className="mt-6 flex h-12 items-center justify-center rounded-md bg-white px-4 font-black text-ink hover:bg-lime-300">
                Activate Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white px-4 py-4 text-ink sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-4">
          {[
            [Router, "Hotspot ready", "Works with MikroTik captive portal"],
            [Headphones, "Local support", "Call or WhatsApp 09013160626"],
            [Zap, "Instant access", "Payment activates internet immediately"],
            [ShieldCheck, "Paystack only", "Secure Nigerian card and transfer checkout"]
          ].map(([Icon, title, copy]) => (
            <div key={String(title)} className="rounded-md border border-black/10 p-4">
              <Icon className="h-6 w-6 text-violet" />
              <p className="mt-3 font-black">{String(title)}</p>
              <p className="mt-1 text-sm leading-5 text-black/62">{String(copy)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Choose your new plan</p>
              <h2 className="mt-2 text-3xl font-black text-white">Simple prepaid internet access</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/68">Plans can be updated from the admin dashboard, so JugiHub can add weekly, monthly, night, and data plans later.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Why choose JugiHub?</p>
            <h2 className="mt-2 text-3xl font-black text-white">Built for quick browsing and easy support.</h2>
            <p className="mt-4 text-sm leading-6 text-white/68">Customers pay, get connected, and start browsing without manual voucher entry. Support still gets voucher records for tracing every successful purchase.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["When does my plan start?", "Immediately after your payment is verified."],
            ["Do I need a voucher code?", "No. A voucher is generated for support records, but your device is logged in automatically."],
            ["Can I buy another plan later?", "Yes. Choose any active plan from this portal when your current access expires."],
            ["Need help?", "Call 09013160626 or email jubemigift@gmail.com."]
          ].map(([title, copy]) => (
            <div key={title} className="border-t border-white/16 py-5">
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{copy}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section id="support" className="bg-white px-4 py-12 text-ink sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet">Contact</p>
            <h2 className="mt-2 text-3xl font-black">Need internet support?</h2>
            <p className="mt-3 text-sm leading-6 text-black/62">Reach JugiHub Internet for payment help, hotspot access, expired plans, and router support.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:09013160626" className="rounded-md border border-black/10 p-5 font-black hover:border-violet">Call 09013160626</a>
            <a href="mailto:jubemigift@gmail.com" className="rounded-md border border-black/10 p-5 font-black hover:border-violet">jubemigift@gmail.com</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/54">
        Terms and conditions apply. JugiHub Internet provides prepaid hotspot access subject to network availability.
      </footer>
    </main>
  );
}
