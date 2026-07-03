import { BarChart3, CreditCard, Router, Users, Wifi } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/plans", label: "Plans", icon: Wifi },
  { href: "/admin/router", label: "Router", icon: Router }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <aside className="fixed inset-x-0 top-0 z-10 border-b border-white/10 bg-ink/88 px-4 py-3 backdrop-blur lg:inset-y-0 lg:right-auto lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <Logo />
        <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-8 lg:grid">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold text-white/72 hover:bg-white/10 hover:text-white">
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="px-4 pb-10 pt-32 sm:px-6 lg:ml-72 lg:px-8 lg:pt-8">{children}</section>
    </main>
  );
}
