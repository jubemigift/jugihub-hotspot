import { HomeExperience } from "../components/home-experience";
import { api } from "../lib/api";

interface Plan {
  id: string;
  name: string;
  description?: string | null;
  priceKobo: number;
  durationMinutes: number;
}

export default async function Page() {
  let plans: Plan[] = [];
  try {
    plans = await api<Plan[]>("/plans");
  } catch {
    plans = [
      {
        id: "daily-unlimited",
        name: "Daily Plan",
        description: "Unlimited browsing for exactly 24 hours.",
        priceKobo: 30000,
        durationMinutes: 1440
      }
    ];
  }
  return <HomeExperience plans={plans} />;
}
