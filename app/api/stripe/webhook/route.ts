import { NextResponse } from "next/server";
import Stripe from "stripe";
import { notifyCheckoutIssue, notifyOrderCompleted } from "@/lib/order-notifications";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!stripeSecretKey || !stripeWebhookSecret) {
    console.error("Stripe webhook is not configured.", {
      hasSecretKey: Boolean(stripeSecretKey),
      hasWebhookSecret: Boolean(stripeWebhookSecret),
    });
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook signature.";
    console.error("Stripe webhook signature verification failed", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const eventSession = event.data.object as Stripe.Checkout.Session;
      const session = await stripe.checkout.sessions.retrieve(eventSession.id, {
        expand: ["line_items"],
      });

      await notifyOrderCompleted({
        session,
        lineItems: session.line_items,
      });
    }

    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await notifyCheckoutIssue(session, event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed", error);
    return NextResponse.json({ error: "Stripe webhook handling failed." }, { status: 500 });
  }
}
