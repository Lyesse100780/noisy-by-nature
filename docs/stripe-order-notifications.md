# Stripe order notifications

Noisy by Nature uses Stripe Checkout for direct shop orders.

## Checkout phone collection

`app/api/checkout/route.ts` enables `phone_number_collection` so Stripe asks the buyer for a phone number during Checkout. Stripe does not expose a stricter `required` flag for this field in the current Checkout API; enabling the collection is the supported Checkout setting.

## Webhook endpoint

Endpoint:

```text
POST https://www.noisybynature.eu/api/stripe/webhook
```

Register it in Stripe Dashboard with these events:

- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`

## Required environment variables

Set this in Vercel production environment:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
```

Seller pings fall back to the existing Formspree contact endpoint when Resend is not configured. For direct email delivery via Resend, set:

```text
RESEND_API_KEY=re_...
ORDER_NOTIFICATION_EMAIL=orders@noisybynature.eu
ORDER_EMAIL_FROM=Noisy by Nature <orders@noisybynature.eu>
```

`STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` are already used by Checkout.

## Behavior

On `checkout.session.completed`:

- sends Noisy an order email with total, Stripe IDs, customer email/phone, shipping address, and line items;
- sends the buyer a confirmation email if `RESEND_API_KEY` is configured.

On `checkout.session.expired` or `checkout.session.async_payment_failed`:

- alerts Noisy with the session ID, payment status, customer email/phone when available, and a Stripe dashboard search link.

Seller alerts always fall back to the existing Formspree endpoint when Resend is not configured. Customer confirmations require Resend; otherwise customers still receive Stripe receipts when Stripe customer emails are enabled.
