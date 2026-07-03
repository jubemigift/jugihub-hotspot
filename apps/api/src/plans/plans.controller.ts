import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreatePlanDto, UpdatePlanDto } from "./plans.dto";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  @Get()
  listActive() {
    return this.plans.listActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS)
  @Get("admin/all")
  listAll() {
    return this.plans.listAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS)
  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.plans.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
    return this.plans.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.plans.disable(id);
  }
}
