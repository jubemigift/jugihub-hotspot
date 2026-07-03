import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MikrotikService } from "../mikrotik/mikrotik.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExpirationJob {
  private readonly logger = new Logger(ExpirationJob.name);

  constructor(private readonly prisma: PrismaService, private readonly mikrotik: MikrotikService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async expireUsers() {
    const expired = await this.prisma.hotspotUser.findMany({
      where: { status: "ACTIVE", expirationTime: { lte: new Date() } },
      take: 100
    });

    for (const user of expired) {
      try {
        await this.mikrotik.disableHotspotUser(user.username);
        await this.mikrotik.disconnectActiveUser(user.username);
        await this.prisma.hotspotUser.update({ where: { id: user.id }, data: { status: "EXPIRED" } });
        await this.prisma.notification.create({
          data: {
            type: "SUBSCRIPTION_EXPIRED",
            title: "Subscription expired",
            message: `${user.username} was disabled after reaching its expiration time.`,
            metadata: { hotspotUserId: user.id }
          }
        });
      } catch (error) {
        this.logger.error(error);
        await this.prisma.notification.create({
          data: {
            type: "API_FAILURE",
            title: "Failed to expire hotspot user",
            message: `Could not disable ${user.username} on MikroTik.`,
            metadata: { hotspotUserId: user.id }
          }
        });
      }
    }
  }
}
