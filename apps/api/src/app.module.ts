import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AdminModule } from "./admin/admin.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AuthModule } from "./auth/auth.module";
import { CustomersModule } from "./customers/customers.module";
import { HotspotModule } from "./hotspot/hotspot.module";
import { ExpirationJob } from "./jobs/expiration.job";
import { MikrotikModule } from "./mikrotik/mikrotik.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PaymentsModule } from "./payments/payments.module";
import { PlansModule } from "./plans/plans.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    PlansModule,
    PaymentsModule,
    CustomersModule,
    MikrotikModule,
    HotspotModule,
    AdminModule,
    AnalyticsModule,
    NotificationsModule
  ],
  providers: [ExpirationJob]
})
export class AppModule {}
