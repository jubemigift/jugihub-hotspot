# API Summary

## Public

- `GET /api/plans`: list active plans.
- `POST /api/hotspot/capture`: capture MikroTik session details.
- `POST /api/payments/start`: create a pending transaction and return gateway redirect URL.
- `POST /api/payments/verify`: verify a transaction and activate access.
- `GET /api/payments/callback/:reference`: gateway redirect verification endpoint.
- `POST /api/payments/webhook/:gateway`: gateway webhook endpoint.

## Admin

All admin routes require `Authorization: Bearer <token>`.

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/admin/dashboard`
- `GET /api/admin/payments`
- `GET /api/customers`
- `GET /api/customers/:id`
- `PATCH /api/customers/:id/disconnect`
- `PATCH /api/customers/:id/disable`
- `GET /api/plans/admin/all`
- `POST /api/plans`
- `PATCH /api/plans/:id`
- `DELETE /api/plans/:id`
- `GET /api/mikrotik/resources`
- `GET /api/mikrotik/active-sessions`
- `GET /api/analytics/summary`
- `GET /api/notifications`
