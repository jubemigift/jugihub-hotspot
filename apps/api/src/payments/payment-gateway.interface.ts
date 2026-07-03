import { Transaction } from "@prisma/client";

export interface PaymentInitRequest {
  amountKobo: number;
  email?: string;
  phone: string;
  fullName: string;
  reference: string;
  callbackUrl: string;
}

export interface PaymentInitResult {
  authorizationUrl: string;
  gatewayReference?: string;
}

export interface PaymentVerificationResult {
  reference: string;
  gatewayReference?: string;
  successful: boolean;
  paidAt?: Date;
  amountKobo?: number;
  raw: unknown;
}

export interface PaymentGateway {
  readonly code: "PAYSTACK" | "FLUTTERWAVE" | "MONNIFY";
  initialize(input: PaymentInitRequest): Promise<PaymentInitResult>;
  verify(reference: string): Promise<PaymentVerificationResult>;
  verifyWebhookSignature(rawBody: string, signature?: string): boolean;
  extractReference(payload: unknown): string | undefined;
  toLogPayload(payload: unknown): Record<string, unknown>;
}

export interface ActivationResult {
  transaction: Transaction;
  autoLoginUrl: string;
  voucherCode: string;
}
