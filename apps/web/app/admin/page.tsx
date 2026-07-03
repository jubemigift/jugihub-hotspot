import { Activity, Banknote, CreditCard, Users, WifiOff } from "lucide-react";
import { AdminShell } from "../../components/admin-shell";
import { api, formatNaira } from "../../lib/api";

interface Dashboard {
  todayRevenueKobo: number;
  weeklyRevenueKobo: number;
  monthlyRevenueKobo: number;
  totalCustomers: number;
  activeUsers: number;
  expiredUsers: number;
  failedPayments: number;
  successfulPayments: number;
  totalVouchers: number;
  totalPlans: number;
}

export default async function AdminPage() {
  let data: Dashboard | null = null;
  try {
    data = await api<Dashboard>("/admin/dashboard", { headers: { Authorization: `Bearer ${process.env.ADMIN_DEMO_TOKEN || ""}` } });
  } catch {
    data = {
      todayRevenueKobo: 0,
      weeklyRevenueKobo: 0,
      monthlyRevenueKobo: 0,
      totalCustomers: 0,
      activeUsers: 0,
      expiredUsers: 0,
      failedPayments: 0,
      successfulPayments: 0,
      totalVouchers: 0,
      totalPlans: 1
    };
  }

  const cards = [
    ["Today", formatNaira(data.todayRevenueKobo), Banknote],
    ["Weekly Revenue", formatNaira(data.weeklyRevenueKobo), Banknote],
    ["Monthly Revenue", formatNaira(data.monthlyRevenueKobo), Banknote],
    ["Customers", data.totalCustomers.toString(), Users],
    ["Active Users", data.activeUsers.toString(), Activity],
    ["Expired Users", data.expiredUsers.toString(), WifiOff],
    ["Successful Payments", data.successfulPayments.toString(), CreditCard],
    ["Failed Payments", data.failedPayments.toString(), CreditCard]
  ];

  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-aurora">Operations</p>
        <h1 className="mt-2 text-3xl font-black text-white">Admin Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={String(label)} className="glass rounded-lg p-5">
            <Icon className="h-6 w-6 text-aurora" />
            <p className="mt-4 text-sm text-white/60">{String(label)}</p>
            <p className="mt-1 text-2xl font-black text-white">{String(value)}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
