import { AdminShell } from "../../../components/admin-shell";
import { api, formatNaira } from "../../../lib/api";

interface PaymentRow {
  id: string;
  reference: string;
  gateway: string;
  status: string;
  amountKobo: number;
  createdAt: string;
  customer: { fullName: string; phone: string; email?: string };
  plan: { name: string };
  voucher?: { code: string; hotspotUser?: { username: string } };
}

export default async function PaymentsPage() {
  let payments: PaymentRow[] = [];
  try {
    payments = await api<PaymentRow[]>("/admin/payments", { headers: { Authorization: `Bearer ${process.env.ADMIN_DEMO_TOKEN || ""}` } });
  } catch {}

  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-white">Payment Management</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-white/12">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="bg-white/10 text-white/68">
            <tr>
              {["Customer", "Phone", "Plan", "Amount", "Gateway", "Status", "Reference", "Voucher", "Date"].map((head) => (
                <th key={head} className="px-4 py-3 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-white/10 text-white/78">
                <td className="px-4 py-3">{payment.customer.fullName}</td>
                <td className="px-4 py-3">{payment.customer.phone}</td>
                <td className="px-4 py-3">{payment.plan.name}</td>
                <td className="px-4 py-3">{formatNaira(payment.amountKobo)}</td>
                <td className="px-4 py-3">{payment.gateway}</td>
                <td className="px-4 py-3">{payment.status}</td>
                <td className="px-4 py-3 font-mono text-xs">{payment.reference}</td>
                <td className="px-4 py-3 font-mono text-xs">{payment.voucher?.code || "-"}</td>
                <td className="px-4 py-3">{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
