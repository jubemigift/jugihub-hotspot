import { Injectable } from "@nestjs/common";
import { MikrotikService } from "../mikrotik/mikrotik.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService, private readonly mikrotik: MikrotikService) {}

  async list(query: { page?: number; pageSize?: number; search?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const where = query.search
      ? {
          OR: [
            { fullName: { contains: query.search, mode: "insensitive" as const } },
            { phone: { contains: query.search } },
            { email: { contains: query.search, mode: "insensitive" as const } },
            { vouchers: { some: { code: { contains: query.search, mode: "insensitive" as const } } } },
            { transactions: { some: { reference: { contains: query.search, mode: "insensitive" as const } } } }
          ]
        }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        include: { hotspotUsers: { orderBy: { createdAt: "desc" }, take: 1 }, transactions: { orderBy: { createdAt: "desc" }, take: 3 } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.customer.count({ where })
    ]);
    return { data, total, page, pageSize };
  }

  detail(id: string) {
    return this.prisma.customer.findUniqueOrThrow({
      where: { id },
      include: { devices: true, hotspotUsers: true, vouchers: true, transactions: { include: { plan: true } } }
    });
  }

  async disconnect(id: string) {
    const users = await this.prisma.hotspotUser.findMany({ where: { customerId: id, status: "ACTIVE" } });
    for (const user of users) await this.mikrotik.disconnectActiveUser(user.username);
    return { disconnected: users.length };
  }

  async disable(id: string) {
    const users = await this.prisma.hotspotUser.findMany({ where: { customerId: id, status: "ACTIVE" } });
    for (const user of users) {
      await this.mikrotik.disableHotspotUser(user.username);
      await this.prisma.hotspotUser.update({ where: { id: user.id }, data: { status: "DISABLED" } });
    }
    return { disabled: users.length };
  }
}
