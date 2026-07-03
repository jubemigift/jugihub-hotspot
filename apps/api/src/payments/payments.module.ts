import { Module } from "@nestjs/common";
import { HotspotModule } from "../hotspot/hotspot.module";
import { FlutterwaveGateway } from "./gateways/flutterwave.gateway";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [HotspotModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, FlutterwaveGateway],
  exports: [PaymentsService]
})
export class PaymentsModule {}
