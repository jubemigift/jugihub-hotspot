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
export class FlutterwaveGateway implements PaymentGateway {
  readonly code = "FLUTTERWAVE" as const;
  private readonly baseUrl = "https://api.flutterwave.com/v3";

  constructor(private readonly config: ConfigService) {}

  async initialize(input: PaymentInitRequest): Promise<PaymentInitResult> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amountKobo / 100,
        currency: "NGN",
        redirect_url: input.callbackUrl,
        customer: {
          email: input.email || `${input.phone}@jugihub.local`,
          phonenumber: input.phone,
          name: input.fullName
        },
        customizations: {
          title: "JugiHub Internet",
          description: "Hotspot internet access"
        }
      })
    });
    const body = await response.json();
    if (!response.ok || body.status !== "success") {
      throw new Error(body.message || "Flutterwave initialization failed");
    }
    return { authorizationUrl: body.data.link, gatewayReference: body.data.id?.toString() };
  }

  async verify(reference: string): Promise<PaymentVerificationResult> {
    const response = await fetch(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`, {
      headers: this.headers()
    });
    const body = await response.json();
    if (!response.ok || body.status !== "success") {
      throw new Error(body.message || "Flutterwave verification failed");
    }
    return {
      reference,
      gatewayReference: body.data.id?.toString(),
      successful: body.data.status === "successful",
      paidAt: body.data.created_at ? new Date(body.data.created_at) : undefined,
      amountKobo: Math.round(Number(body.data.amount) * 100),
      raw: body
    };
  }

  verifyWebhookSignature(_rawBody: string, signature?: string): boolean {
    const secretHash = this.config.get<string>("FLUTTERWAVE_SECRET_HASH");
    if (!secretHash || !signature) return false;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(secretHash));
  }

  extractReference(payload: any): string | undefined {
    return payload?.data?.tx_ref;
  }

  toLogPayload(payload: unknown) {
    return payload as Record<string, unknown>;
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.config.getOrThrow<string>("FLUTTERWAVE_SECRET_KEY")}`,
      "Content-Type": "application/json"
    };
  }
}
