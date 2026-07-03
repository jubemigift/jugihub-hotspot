import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { MikrotikService } from "./mikrotik.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS, AdminRole.SUPPORT)
@Controller("mikrotik")
export class MikrotikController {
  constructor(private readonly mikrotik: MikrotikService) {}

  @Get("active-sessions")
  activeSessions() {
    return this.mikrotik.readActiveSessions();
  }

  @Get("resources")
  resources() {
    return this.mikrotik.readSystemResources();
  }
}
