import { Injectable } from "@nestjs/common";
import { PaymentStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const revenue = (from: Date) =>
      this.prisma.transaction.aggregate({
        where: { status: "SUCCESSFUL", paidAt: { gte: from } },
        _sum: { amountKobo: true }
      });

    const [today, week, month, totalCustomers, activeUsers, expiredUsers, failedPayments, successfulPayments, vouchers, plans] =
      await this.prisma.$transaction([
        revenue(startOfDay),
        revenue(startOfWeek),
        revenue(startOfMonth),
        this.prisma.customer.count(),
        this.prisma.hotspotUser.count({ where: { status: "ACTIVE" } }),
        this.prisma.hotspotUser.count({ where: { status: "EXPIRED" } }),
        this.prisma.transaction.count({ where: { status: "FAILED" } }),
        this.prisma.transaction.count({ where: { status: "SUCCESSFUL" } }),
        this.prisma.voucher.count(),
        this.prisma.plan.count()
      ]);

    return {
      todayRevenueKobo: today._sum.amountKobo ?? 0,
      weeklyRevenueKobo: week._sum.amountKobo ?? 0,
      monthlyRevenueKobo: month._sum.amountKobo ?? 0,
      totalCustomers,
      activeUsers,
      expiredUsers,
      failedPayments,
      successfulPayments,
      totalVouchers: vouchers,
      totalPlans: plans
    };
  }

  payments(query: { search?: string; status?: string; from?: string; to?: string }) {
    return this.prisma.transaction.findMany({
      where: {
        status: query.status ? (query.status as PaymentStatus) : undefined,
        createdAt: {
          gte: query.from ? new Date(query.from) : undefined,
          lte: query.to ? new Date(query.to) : undefined
        },
        OR: query.search
          ? [
              { reference: { contains: query.search, mode: "insensitive" } },
              { gatewayReference: { contains: query.search, mode: "insensitive" } },
              { customer: { fullName: { contains: query.search, mode: "insensitive" } } },
              { customer: { phone: { contains: query.search } } },
              { voucher: { code: { contains: query.search, mode: "insensitive" } } }
            ]
          : undefined
      },
      include: { customer: true, plan: true, voucher: { include: { hotspotUser: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }
}
