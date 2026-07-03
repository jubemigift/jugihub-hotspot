import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentAdmin } from "../common/decorators/current-admin.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh")
  refresh(@CurrentAdmin("id") adminId: string) {
    return this.auth.issueTokens(adminId);
  }
}
