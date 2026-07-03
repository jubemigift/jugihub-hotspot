import { Body, Controller, Post } from "@nestjs/common";
import { CaptureSessionDto } from "./hotspot.dto";
import { HotspotService } from "./hotspot.service";

@Controller("hotspot")
export class HotspotController {
  constructor(private readonly hotspot: HotspotService) {}

  @Post("capture")
  capture(@Body() dto: CaptureSessionDto) {
    return this.hotspot.captureSession(dto);
  }
}
