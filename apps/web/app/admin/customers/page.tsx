import { AdminShell } from "../../../components/admin-shell";
import { api } from "../../../lib/api";

interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  createdAt: string;
  hotspotUsers: { username: string; status: string; expirationTime?: string }[];
}

export default async function CustomersPage() {
  let response: { data: Customer[] } = { data: [] };
  try {
    response = await api<{ data: Customer[] }>("/customers", { headers: { Authorization: `Bearer ${process.env.ADMIN_DEMO_TOKEN || ""}` } });
  } catch {}

  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-white">Customer Management</h1>
      <div className="mt-6 grid gap-3">
        {response.data.map((customer) => (
          <div key={customer.id} className="glass rounded-lg p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="font-bold text-white">{customer.fullName}</p>
                <p className="mt-1 text-sm text-white/64">{customer.phone} {customer.email ? `- ${customer.email}` : ""}</p>
              </div>
              <p className="text-sm font-semibold text-aurora">{customer.hotspotUsers[0]?.status || "NO ACCESS"}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
