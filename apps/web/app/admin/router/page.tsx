import { Cpu, HardDrive, RadioTower } from "lucide-react";
import { AdminShell } from "../../../components/admin-shell";
import { api } from "../../../lib/api";

export default async function RouterPage() {
  let resources: any[] = [];
  try {
    resources = await api<any[]>("/mikrotik/resources", { headers: { Authorization: `Bearer ${process.env.ADMIN_DEMO_TOKEN || ""}` } });
  } catch {}
  const router = resources[0] || {};

  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-white">MikroTik Router</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-lg p-5">
          <RadioTower className="h-6 w-6 text-success" />
          <p className="mt-4 text-sm text-white/60">Status</p>
          <p className="mt-1 text-2xl font-black text-white">{resources.length ? "Connected" : "Unknown"}</p>
        </div>
        <div className="glass rounded-lg p-5">
          <Cpu className="h-6 w-6 text-aurora" />
          <p className="mt-4 text-sm text-white/60">CPU Load</p>
          <p className="mt-1 text-2xl font-black text-white">{router["cpu-load"] ?? "-"}%</p>
        </div>
        <div className="glass rounded-lg p-5">
          <HardDrive className="h-6 w-6 text-aurora" />
          <p className="mt-4 text-sm text-white/60">Uptime</p>
          <p className="mt-1 text-2xl font-black text-white">{router.uptime ?? "-"}</p>
        </div>
      </div>
    </AdminShell>
  );
}
