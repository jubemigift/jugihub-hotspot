import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePlanDto, UpdatePlanDto } from "./plans.dto";

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      include: { bandwidthProfile: true },
      orderBy: [{ sortOrder: "asc" }, { priceKobo: "asc" }]
    });
  }

  listAll() {
    return this.prisma.plan.findMany({
      include: { bandwidthProfile: true },
      orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }]
    });
  }

  create(dto: CreatePlanDto) {
    return this.prisma.plan.create({ data: dto });
  }

  update(id: string, dto: Partial<UpdatePlanDto>) {
    return this.prisma.plan.update({ where: { id }, data: dto });
  }

  disable(id: string) {
    return this.prisma.plan.update({ where: { id }, data: { isActive: false } });
  }
}
