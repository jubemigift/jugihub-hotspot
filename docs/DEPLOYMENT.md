# Production Deployment Guide

## 1. RouterOS Preparation

1. Enable RouterOS API on the MikroTik router.
2. Create a least-privilege API user that can manage hotspot users and active sessions.
3. Create bandwidth profiles such as `jugihub-standard` and `jugihub-admin`.
4. Update the hotspot login page to point customers to the web portal and include MikroTik session parameters.

## 2. Environment

Copy `.env.example` to `.env` and replace every secret:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `MIKROTIK_HOST`
- `MIKROTIK_USERNAME`
- `MIKROTIK_PASSWORD`
- Gateway credentials for Paystack, Flutterwave, and Monnify

Use real TLS certificates at `infrastructure/nginx/certs/fullchain.pem` and `privkey.pem`.

## 3. Database

Run:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run prisma:seed --workspace @jugihub/api
```

The seed creates:

- `Daily Plan` at ₦300 for 24 hours
- `jugihub-standard` bandwidth profile
- `jugihub-admin` profile
- Initial admin `admin@jugihub.com`

Change the seeded password immediately.

## 4. Docker

Run:

```bash
docker compose up --build
```

The stack exposes:

- Web: `https://your-domain/`
- API: `https://your-domain/api`
- PostgreSQL internally as `postgres:5432`

## 5. Operational Checklist

- Confirm payment callbacks are reachable from gateway providers.
- Confirm the MikroTik router can be reached from the API container.
- Run `npm run build`, `npm run lint`, and backend tests in CI after dependencies are installed.
- Buy a test plan using gateway test mode.
- Verify that the RouterOS hotspot user is created.
- Verify the device is automatically logged in.
- Confirm the account is disabled after the exact expiration time.
- Configure backups for PostgreSQL.
- Configure log aggregation and uptime monitoring.
