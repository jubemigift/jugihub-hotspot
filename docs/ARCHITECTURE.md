# JugiHub Internet Hotspot Architecture

## Overview

The system is a production-oriented monorepo with three layers:

- `apps/api`: NestJS API for authentication, plans, payments, MikroTik RouterOS control, analytics, notifications, expiry jobs, and audit logging.
- `apps/web`: Next.js captive portal and admin dashboard.
- `packages/shared`: shared brand constants and cross-app types.

PostgreSQL is the source of truth. MikroTik RouterOS remains the network enforcement layer. The application never simulates RouterOS responses; it calls the configured router through the RouterOS API.

## Payment And Activation Flow

1. Customer lands on the captive portal.
2. MikroTik query parameters are posted to `/api/hotspot/capture`.
3. Customer selects a database-backed plan.
4. `/api/payments/start` creates or updates the customer, creates a pending transaction, and redirects to the selected gateway.
5. Paystack callback/webhook is verified before activation.
6. On success, the API creates a RouterOS hotspot user, stores `paymentTime`, `activationTime`, and `expirationTime`, generates a support voucher, and returns an automatic MikroTik login URL.
7. The expiry worker runs every minute. Expired accounts are disabled and active sessions are disconnected.

## Security Decisions

- Admin passwords are hashed with bcrypt.
- JWT secrets and gateway/router credentials are environment variables.
- Payment webhooks verify signatures before activation.
- Prisma parameterizes database access and enforces relational integrity.
- Helmet, CORS, DTO validation, and strict TypeScript are enabled.
- Router password is referenced from env in the router record; production deployments should replace this with KMS or Vault encryption.

## MikroTik Hotspot Notes

Configure the hotspot login page to forward session values such as `mac`, `ip`, `link-login-only`, and `link-orig` to the portal. After successful payment, the system builds an automatic login URL using the captured login endpoint, generated username, and generated password.

The default profile is selected from the purchased plan's `BandwidthProfile.mikrotikName`.

## Scaling Notes

- Keep API stateless and scale horizontally behind NGINX.
- Run expiry workers as a single instance, or move them to a queue/worker with distributed locks.
- Add Redis-backed rate limiting before public payment endpoints.
- Use read replicas for analytics if reporting load grows.
