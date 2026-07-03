import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GatewayCode, PaymentStatus, Prisma } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { HotspotService } from "../hotspot/hotspot.service";
import { PrismaService } from "../prisma/prisma.service";
import { FlutterwaveGateway } from "./gateways/flutterwave.gateway";
import { PaymentGateway } from "./payment-gateway.interface";
import { StartPaymentDto } from "./payments.dto";

const referenceToken = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 18);

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly hotspot: HotspotService,
    private readonly flutterwave: FlutterwaveGateway
  ) {}

  async start(dto: StartPaymentDto) {
    const plan = await this.prisma.plan.findFirstOrThrow({ where: { id: dto.planId, isActive: true } });
    const gateway = this.gateway(dto.gateway ?? this.config.get<"flutterwave">("PAYMENT_DEFAULT_GATEWAY", "flutterwave"));
    const reference = `JH-${referenceToken()}`;
    const customer = await this.prisma.customer.upsert({
      where: { phone: dto.phone },
      update: { fullName: dto.fullName, email: dto.email },
      create: { fullName: dto.fullName, phone: dto.phone, email: dto.email }
    });
    const router = await this.ensureDefaultRouter();
    const callbackUrl = `${this.config.getOrThrow<string>("API_URL")}/api/payments/callback/${reference}${
      dto.sessionId ? `?sessionId=${encodeURIComponent(dto.sessionId)}` : ""
    }`;

    const initialized = await gateway.initialize({
      amountKobo: plan.priceKobo,
      email: dto.email,
      phone: dto.phone,
      fullName: dto.fullName,
      reference,
      callbackUrl
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        reference,
        gatewayReference: initialized.gatewayReference,
        gateway: gateway.code as GatewayCode,
        status: PaymentStatus.PENDING,
        amountKobo: plan.priceKobo,
        authorizationUrl: initialized.authorizationUrl,
        customerId: customer.id,
        planId: plan.id
      }
    });

    await this.prisma.activityLog.create({
      data: {
        action: "PAYMENT_INITIALIZED",
        entityType: "Transaction",
        entityId: transaction.id,
        metadata: { gateway: gateway.code, routerId: router.id }
      }
    });

    return { authorizationUrl: initialized.authorizationUrl, reference, transactionId: transaction.id };
  }

  async verifyAndActivate(reference: string, sessionId?: string) {
    const transaction = await this.prisma.transaction.findUniqueOrThrow({
      where: { reference },
      include: { customer: true, plan: true, voucher: true }
    });

    if (transaction.status === PaymentStatus.SUCCESSFUL && transaction.voucher) {
      const hotspotUser = await this.prisma.hotspotUser.findFirstOrThrow({ where: { vouchers: { some: { id: transaction.voucher.id } } } });
      return { autoLoginUrl: hotspotUser.autoLoginUrl, voucherCode: transaction.voucher.code, reference };
    }

    const gateway = this.gateway(transaction.gateway.toLowerCase() as "flutterwave");
    const verification = await gateway.verify(reference);
    if (!verification.successful) {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: PaymentStatus.FAILED, failureReason: "Gateway verification returned unsuccessful status" }
      });
      throw new BadRequestException("Payment was not successful");
    }
    if (verification.amountKobo && verification.amountKobo !== transaction.amountKobo) {
      throw new BadRequestException("Payment amount mismatch");
    }

    const paidAt = verification.paidAt ?? new Date();
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.SUCCESSFUL,
        gatewayReference: verification.gatewayReference,
        paidAt,
        verifiedAt: new Date()
      }
    });

    const router = await this.ensureDefaultRouter();
    const activation = await this.hotspot.provisionPaidAccess({
      transactionId: transaction.id,
      customerId: transaction.customerId,
      planId: transaction.planId,
      routerId: router.id,
      sessionId,
      paymentTime: paidAt
    });

    return { autoLoginUrl: activation.autoLoginUrl, voucherCode: activation.voucherCode, reference };
  }

  async handleWebhook(gatewayCode: string, payload: unknown, rawBody: string, signature?: string) {
    const gateway = this.gateway(gatewayCode as "flutterwave");
    const signatureValid = gateway.verifyWebhookSignature(rawBody, signature);
    const reference = gateway.extractReference(payload);

    await this.prisma.paymentLog.create({
      data: {
        gateway: gateway.code as GatewayCode,
        eventType: "WEBHOOK",
        signatureValid,
        payload: gateway.toLogPayload(payload) as Prisma.InputJsonValue,
        transaction: reference ? { connect: { reference } } : undefined
      }
    });

    if (!signatureValid || !reference) return { received: true };
    await this.verifyAndActivate(reference);
    return { received: true };
  }

  private gateway(code: "flutterwave"): PaymentGateway {
    const normalized = code.toLowerCase();
    if (normalized === "flutterwave") return this.flutterwave;
    throw new BadRequestException("Only Flutterwave is supported");
  }

  private async ensureDefaultRouter() {
    return this.prisma.mikrotikRouter.upsert({
      where: {
        host_apiPort: {
          host: this.config.getOrThrow<string>("MIKROTIK_HOST"),
          apiPort: Number(this.config.get<string>("MIKROTIK_PORT", "8728"))
        }
      },
      update: {},
      create: {
        name: "Primary MikroTik",
        host: this.config.getOrThrow<string>("MIKROTIK_HOST"),
        apiPort: Number(this.config.get<string>("MIKROTIK_PORT", "8728")),
        username: this.config.getOrThrow<string>("MIKROTIK_USERNAME"),
        encryptedPassword: "env:MIKROTIK_PASSWORD",
        useTls: this.config.get<string>("MIKROTIK_TLS", "false") === "true",
        hotspotServer: this.config.get<string>("MIKROTIK_DEFAULT_HOTSPOT_SERVER", "hotspot1")
      }
    });
  }
}
