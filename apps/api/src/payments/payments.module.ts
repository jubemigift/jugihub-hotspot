import { Module } from "@nestjs/common";
import { HotspotModule } from "../hotspot/hotspot.module";
import { PaystackGateway } from "./gateways/paystack.gateway";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [HotspotModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackGateway],
  exports: [PaymentsService]
})
export class PaymentsModule {}
