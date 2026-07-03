import { Module } from "@nestjs/common";
import { HotspotModule } from "../hotspot/hotspot.module";
import { FlutterwaveGateway } from "./gateways/flutterwave.gateway";
import { MonnifyGateway } from "./gateways/monnify.gateway";
import { PaystackGateway } from "./gateways/paystack.gateway";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [HotspotModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackGateway, FlutterwaveGateway, MonnifyGateway],
  exports: [PaymentsService]
})
export class PaymentsModule {}
