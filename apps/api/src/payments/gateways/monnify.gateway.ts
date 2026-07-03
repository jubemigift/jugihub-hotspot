import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import crypto from "crypto";
import {
  PaymentGateway,
  PaymentInitRequest,
  PaymentInitResult,
  PaymentVerificationResult
} from "../payment-gateway.interface";

@Injectable()
export class MonnifyGateway implements PaymentGateway {
  readonly code = "MONNIFY" as const;
  private readonly baseUrl = "https://api.monnify.com/api/v1";

  constructor(private readonly config: ConfigService) {}

  async initialize(input: PaymentInitRequest): Promise<PaymentInitResult> {
    const response = await fetch(`${this.baseUrl}/merchant/transactions/init-transaction`, {
      method: "POST",
      headers: await this.headers(),
      body: JSON.stringify({
        amount: input.amountKobo / 100,
        customerName: input.fullName,
        customerEmail: input.email || `${input.phone}@jugihub.local`,
        paymentReference: input.reference,
        paymentDescription: "JugiHub Internet access",
        currencyCode: "NGN",
        contractCode: this.config.getOrThrow<string>("MONNIFY_CONTRACT_CODE"),
        redirectUrl: input.callbackUrl
      })
    });
    const body = await response.json();
    if (!response.ok || !body.requestSuccessful) throw new Error(body.responseMessage || "Monnify initialization failed");
    return { authorizationUrl: body.responseBody.checkoutUrl, gatewayReference: body.responseBody.transactionReference };
  }

  async verify(reference: string): Promise<PaymentVerificationResult> {
    const response = await fetch(`${this.baseUrl}/merchant/transactions/query?paymentReference=${reference}`, {
      headers: await this.headers()
    });
    const body = await response.json();
    if (!response.ok || !body.requestSuccessful) throw new Error(body.responseMessage || "Monnify verification failed");
    return {
      reference,
      gatewayReference: body.responseBody.transactionReference,
      successful: body.responseBody.paymentStatus === "PAID",
      paidAt: body.responseBody.paidOn ? new Date(body.responseBody.paidOn) : undefined,
      amountKobo: Math.round(Number(body.responseBody.amountPaid) * 100),
      raw: body
    };
  }

  verifyWebhookSignature(rawBody: string, signature?: string): boolean {
    if (!signature) return false;
    const secret = this.config.getOrThrow<string>("MONNIFY_SECRET_KEY");
    const digest = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  }

  extractReference(payload: any): string | undefined {
    return payload?.eventData?.paymentReference;
  }

  toLogPayload(payload: unknown) {
    return payload as Record<string, unknown>;
  }

  private async headers() {
    const apiKey = this.config.getOrThrow<string>("MONNIFY_API_KEY");
    const secret = this.config.getOrThrow<string>("MONNIFY_SECRET_KEY");
    return {
      Authorization: `Basic ${Buffer.from(`${apiKey}:${secret}`).toString("base64")}`,
      "Content-Type": "application/json"
    };
  }
}
