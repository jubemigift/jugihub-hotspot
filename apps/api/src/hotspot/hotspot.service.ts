import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import { MikrotikService } from "../mikrotik/mikrotik.service";
import { PrismaService } from "../prisma/prisma.service";
import { CaptureSessionDto } from "./hotspot.dto";

const voucherAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const voucherPart = customAlphabet(voucherAlphabet, 4);
const passwordToken = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 18);

@Injectable()
export class HotspotService {
  constructor(private readonly prisma: PrismaService, private readonly mikrotik: MikrotikService) {}

  async captureSession(dto: CaptureSessionDto) {
    const [session] = await this.prisma.$transaction([
      this.prisma.session.create({ data: dto }),
      dto.macAddress
        ? this.prisma.device.upsert({
            where: { macAddress: dto.macAddress },
            update: { ipAddress: dto.ipAddress, userAgent: dto.userAgent, lastSeenAt: new Date() },
            create: { macAddress: dto.macAddress, ipAddress: dto.ipAddress, userAgent: dto.userAgent }
          })
        : this.prisma.device.findFirst({ where: { macAddress: "__never__" } })
    ]);
    return { sessionId: session.id };
  }

  async provisionPaidAccess(input: {
    transactionId: string;
    customerId: string;
    planId: string;
    routerId: string;
    sessionId?: string;
    paymentTime: Date;
  }) {
    const plan = await this.prisma.plan.findUniqueOrThrow({ where: { id: input.planId }, include: { bandwidthProfile: true } });
    const session = input.sessionId ? await this.prisma.session.findUnique({ where: { id: input.sessionId } }) : null;
    const rawPassword = passwordToken();
    const username = `JUGI-${voucherPart()}-${voucherPart()}`;
    const activationTime = input.paymentTime;
    const expirationTime = new Date(activationTime.getTime() + plan.durationMinutes * 60_000);
    const profile = plan.bandwidthProfile?.mikrotikName ?? "default";

    const mikrotikUserId = await this.mikrotik.createHotspotUser({
      username,
      password: rawPassword,
      profile,
      macAddress: session?.macAddress ?? undefined,
      comment: `JugiHub paid access ${input.transactionId}`
    });

    const voucherCode = await this.generateVoucherCode();
    const loginUrl = session?.linkLoginOnly ?? "http://login.jugihub.local/login";
    const autoLoginUrl = this.mikrotik.buildAutoLoginUrl({
      loginUrl,
      username,
      password: rawPassword,
      linkOrig: session?.linkOrig ?? undefined
    });

    const hotspotUser = await this.prisma.hotspotUser.create({
      data: {
        username,
        passwordHash: await bcrypt.hash(rawPassword, 12),
        mikrotikUserId,
        mikrotikProfile: profile,
        status: "ACTIVE",
        paymentTime: input.paymentTime,
        activationTime,
        expirationTime,
        autoLoginUrl,
        customerId: input.customerId,
        planId: input.planId,
        routerId: input.routerId,
        bandwidthProfileId: plan.bandwidthProfileId
      }
    });

    await this.prisma.$transaction([
      this.prisma.voucher.create({
        data: {
          code: voucherCode,
          customerId: input.customerId,
          transactionId: input.transactionId,
          hotspotUserId: hotspotUser.id
        }
      }),
      this.prisma.session.updateMany({
        where: { id: input.sessionId },
        data: { customerId: input.customerId, hotspotUserId: hotspotUser.id, routerId: input.routerId }
      }),
      this.prisma.activityLog.create({
        data: {
          action: "AUTO_HOTSPOT_ACTIVATION",
          entityType: "HotspotUser",
          entityId: hotspotUser.id,
          metadata: { voucherCode, expirationTime }
        }
      })
    ]);

    return { autoLoginUrl, voucherCode, hotspotUser };
  }

  private async generateVoucherCode() {
    for (let i = 0; i < 5; i += 1) {
      const code = `JUGI-${voucherPart()}-${voucherPart()}`;
      const exists = await this.prisma.voucher.findUnique({ where: { code } });
      if (!exists) return code;
    }
    throw new Error("Unable to generate unique voucher code");
  }
}
