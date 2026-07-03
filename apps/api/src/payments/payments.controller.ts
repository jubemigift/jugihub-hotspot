import { Body, Controller, Get, Headers, Param, Post, Query, RawBodyRequest, Req } from "@nestjs/common";
import { Request } from "express";
import { PaymentsService } from "./payments.service";
import { StartPaymentDto, VerifyPaymentDto } from "./payments.dto";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post("start")
  start(@Body() dto: StartPaymentDto) {
    return this.payments.start(dto);
  }

  @Post("verify")
  verify(@Body() dto: VerifyPaymentDto) {
    return this.payments.verifyAndActivate(dto.reference, dto.sessionId);
  }

  @Get("callback/:reference")
  callback(@Param("reference") reference: string, @Query("sessionId") sessionId?: string) {
    return this.payments.verifyAndActivate(reference, sessionId);
  }

  @Post("webhook/:gateway")
  webhook(
    @Param("gateway") gateway: string,
    @Req() req: RawBodyRequest<Request>,
    @Headers("x-paystack-signature") paystackSignature?: string,
    @Headers("verif-hash") flutterwaveSignature?: string,
    @Headers("monnify-signature") monnifySignature?: string
  ) {
    const raw = req.rawBody?.toString("utf8") ?? JSON.stringify(req.body);
    return this.payments.handleWebhook(gateway, req.body, raw, paystackSignature ?? flutterwaveSignature ?? monnifySignature);
  }
}
