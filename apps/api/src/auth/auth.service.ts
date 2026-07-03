import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(dto: LoginDto, ipAddress?: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.prisma.$transaction([
      this.prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } }),
      this.prisma.activityLog.create({
        data: {
          actorAdminId: admin.id,
          action: "ADMIN_LOGIN",
          entityType: "Admin",
          entityId: admin.id,
          ipAddress
        }
      })
    ]);

    return this.issueTokens(admin.id);
  }

  async issueTokens(adminId: string) {
    const admin = await this.prisma.admin.findUniqueOrThrow({ where: { id: adminId } });
    const payload = { sub: admin.id, role: admin.role, email: admin.email };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: this.config.get<string>("JWT_ACCESS_TTL", "15m")
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.config.get<string>("JWT_REFRESH_TTL", "7d")
      }),
      admin: { id: admin.id, email: admin.email, fullName: admin.fullName, role: admin.role }
    };
  }
}
