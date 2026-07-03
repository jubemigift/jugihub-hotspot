# JugiHub Internet Hotspot Management System

Production-oriented ISP hotspot platform for MikroTik RouterOS, online payment, automatic customer activation, voucher records, admin operations, analytics, and Docker deployment.

## Included

- NestJS API with Prisma/PostgreSQL
- Next.js captive portal and admin dashboard
- Payment gateway abstraction for Paystack, Flutterwave, and Monnify
- RouterOS API integration service
- Automatic hotspot activation after verified payment
- Exact expiration logic with scheduled disconnect/disable
- Normalized database schema and seed data
- Docker Compose and NGINX HTTPS reverse proxy
- Deployment and MikroTik setup documentation

## Start Locally

```bash
cp .env.example .env
npm install
npm run db:generate
npm run prisma:dev --workspace @jugihub/api
npm run dev
```

Open:

- Customer portal: `http://localhost:3000`
- API: `http://localhost:4000/api`

See `docs/DEPLOYMENT.md` before deploying to a live ISP environment.
