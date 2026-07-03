import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [planStats, gatewayStats, customerGrowth] = await this.prisma.$transaction([
      this.prisma.transaction.groupBy({
        by: ["planId"],
        where: { status: "SUCCESSFUL" },
        _count: true,
        _sum: { amountKobo: true },
        orderBy: { _count: { planId: "desc" } }
      }),
      this.prisma.transaction.groupBy({
        by: ["gateway"],
        where: { status: "SUCCESSFUL" },
        _count: true,
        _sum: { amountKobo: true }
      }),
      this.prisma.customer.groupBy({
        by: ["createdAt"],
        _count: true,
        orderBy: { createdAt: "asc" },
        take: 30
      })
    ]);

    return { planStats, gatewayStats, customerGrowth };
  }
}
