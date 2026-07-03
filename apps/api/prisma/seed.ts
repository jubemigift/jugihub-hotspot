import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.bandwidthProfile.upsert({
    where: { mikrotikName: "jugihub-standard" },
    update: {},
    create: {
      name: "JugiHub Standard",
      mikrotikName: "jugihub-standard",
      rateLimit: "10M/10M",
      sharedUsers: 1
    }
  });

  await prisma.bandwidthProfile.upsert({
    where: { mikrotikName: "jugihub-admin" },
    update: {},
    create: {
      name: "JugiHub Admin",
      mikrotikName: "jugihub-admin",
      rateLimit: null,
      sharedUsers: 10,
      isAdminProfile: true
    }
  });

  await prisma.plan.upsert({
    where: { slug: "daily-unlimited" },
    update: {},
    create: {
      name: "Daily Plan",
      slug: "daily-unlimited",
      description: "Unlimited browsing for exactly 24 hours.",
      priceKobo: 30000,
      durationMinutes: 1440,
      isUnlimited: true,
      bandwidthProfileId: profile.id,
      sortOrder: 1
    }
  });

  await prisma.admin.upsert({
    where: { email: "admin@jugihub.com" },
    update: {},
    create: {
      email: "admin@jugihub.com",
      fullName: "JugiHub Super Admin",
      role: AdminRole.SUPER_ADMIN,
      passwordHash: await bcrypt.hash("ChangeMeImmediately!2026", 12)
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
