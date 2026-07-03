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
export class PaystackGateway implements PaymentGateway {
  readonly code = "PAYSTACK" as const;
  private readonly baseUrl = "https://api.paystack.co";

  constructor(private readonly config: ConfigService) {}

  async initialize(input: PaymentInitRequest): Promise<PaymentInitResult> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        amount: input.amountKobo,
        email: input.email || `${input.phone}@jugihub.local`,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: { phone: input.phone, fullName: input.fullName }
      })
    });
    const body = await response.json();
    if (!response.ok || !body.status) throw new Error(body.message || "Paystack initialization failed");
    return { authorizationUrl: body.data.authorization_url, gatewayReference: body.data.reference };
  }

  async verify(reference: string): Promise<PaymentVerificationResult> {
    const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, { headers: this.headers() });
    const body = await response.json();
    if (!response.ok || !body.status) throw new Error(body.message || "Paystack verification failed");
    return {
      reference,
      gatewayReference: body.data.reference,
      successful: body.data.status === "success",
      paidAt: body.data.paid_at ? new Date(body.data.paid_at) : undefined,
      amountKobo: body.data.amount,
      raw: body
    };
  }

  verifyWebhookSignature(rawBody: string, signature?: string): boolean {
    if (!signature) return false;
    const secret = this.config.getOrThrow<string>("PAYSTACK_SECRET_KEY");
    const digest = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  }

  extractReference(payload: any): string | undefined {
    return payload?.data?.reference;
  }

  toLogPayload(payload: unknown) {
    return payload as Record<string, unknown>;
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.config.getOrThrow<string>("PAYSTACK_SECRET_KEY")}`,
      "Content-Type": "application/json"
    };
  }
}
