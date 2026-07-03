import { AdminShell } from "../../../components/admin-shell";
import { PlanCardProps } from "../../../components/plan-card";
import { api, formatNaira } from "../../../lib/api";

export default async function PlansAdminPage() {
  let plans: PlanCardProps["plan"][] = [];
  try {
    plans = await api<PlanCardProps["plan"][]>("/plans/admin/all", { headers: { Authorization: `Bearer ${process.env.ADMIN_DEMO_TOKEN || ""}` } });
  } catch {}

  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-white">Internet Plans</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="glass rounded-lg p-5">
            <p className="text-xl font-black text-white">{plan.name}</p>
            <p className="mt-2 text-sm text-white/64">{plan.description}</p>
            <p className="mt-4 text-2xl font-black text-white">{formatNaira(plan.priceKobo)}</p>
            <p className="mt-1 text-sm text-aurora">{plan.durationMinutes} minutes</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
