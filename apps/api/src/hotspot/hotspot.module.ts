import { Module } from "@nestjs/common";
import { MikrotikModule } from "../mikrotik/mikrotik.module";
import { HotspotController } from "./hotspot.controller";
import { HotspotService } from "./hotspot.service";

@Module({
  imports: [MikrotikModule],
  controllers: [HotspotController],
  providers: [HotspotService],
  exports: [HotspotService]
})
export class HotspotModule {}
