import Stripe from "stripe";

const formspreeEndpoint =
  process.env.FORMSPREE_ORDER_ENDPOINT?.trim() ||
  process.env.FORMSPREE_CONTACT_ENDPOINT?.trim() ||
  "https://formspree.io/f/mnjyjjkw";

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const orderNotificationEmail = process.env.ORDER_NOTIFICATION_EMAIL?.trim();
const orderEmailFrom = process.env.ORDER_EMAIL_FROM?.trim() || "Noisy by Nature <orders@noisybynature.eu>";

type StripeLineItem = Stripe.ApiList<Stripe.LineItem> | Stripe.LineItem[] | null | undefined;

type OrderNotificationInput = {
  session: Stripe.Checkout.Session;
  lineItems?: StripeLineItem;
};

function formatAmount(amount: number | null | undefined, currency: string | null | undefined) {
  if (typeof amount !== "number") return "n/a";
  return `${(amount / 100).toFixed(2)} ${(currency ?? "eur").toUpperCase()}`;
}

function getLineItems(lineItems?: StripeLineItem) {
  if (!lineItems) return [];
  return Array.isArray(lineItems) ? lineItems : lineItems.data;
}

function formatLineItems(lineItems?: StripeLineItem) {
  const items = getLineItems(lineItems);

  if (items.length === 0) return "No line items returned by Stripe.";

  return items
    .map((item) => {
      const quantity = item.quantity ?? 1;
      const description = item.description || item.price?.product?.toString() || "Item";
      const amount = formatAmount(item.amount_total, item.currency);
      return `- ${quantity} × ${description} — ${amount}`;
    })
    .join("\n");
}

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return "n/a";

  return [address.line1, address.line2, [address.postal_code, address.city].filter(Boolean).join(" "), address.state, address.country]
    .filter(Boolean)
    .join("\n");
}

async function sendResendEmail(to: string, subject: string, text: string) {
  if (!resendApiKey) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: orderEmailFrom,
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected email: ${detail}`);
  }

  return true;
}

async function sendSellerFormspreeNotification(subject: string, message: string, replyTo?: string | null) {
  const response = await fetch(formspreeEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Stripe Checkout",
      email: replyTo || orderNotificationEmail || "orders@noisybynature.eu",
      message,
      _subject: subject,
      _replyto: replyTo || undefined,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Formspree rejected notification: ${detail}`);
  }
}

export async function notifyOrderCompleted({ session, lineItems }: OrderNotificationInput) {
  const customer = session.customer_details;
  const customerEmail = customer?.email;
  const shippingDetails = session.collected_information?.shipping_details;
  const customerName = customer?.name || shippingDetails?.name || "Customer";
  const customerPhone = customer?.phone || "n/a";
  const total = formatAmount(session.amount_total, session.currency);
  const shippingAddress = formatAddress(shippingDetails?.address || customer?.address);
  const orderUrl = session.url ? session.url : `https://dashboard.stripe.com/payments/${session.payment_intent ?? session.id}`;
  const items = formatLineItems(lineItems);

  const sellerSubject = `New Noisy order — ${total}`;
  const sellerMessage = `A Stripe Checkout payment succeeded.\n\nSession: ${session.id}\nPayment intent: ${session.payment_intent ?? "n/a"}\nTotal: ${total}\nCustomer: ${customerName}\nEmail: ${customerEmail ?? "n/a"}\nPhone: ${customerPhone}\n\nShipping address:\n${shippingAddress}\n\nItems:\n${items}\n\nStripe:\n${orderUrl}`;

  const sellerNotifiedByResend = orderNotificationEmail
    ? await sendResendEmail(orderNotificationEmail, sellerSubject, sellerMessage)
    : false;

  if (!sellerNotifiedByResend) {
    await sendSellerFormspreeNotification(sellerSubject, sellerMessage, customerEmail);
  }

  if (customerEmail) {
    const customerSubject = "Your Noisy by Nature order is confirmed";
    const customerMessage = `Hi ${customerName},\n\nThanks for your Noisy by Nature order — your payment has been received.\n\nOrder summary:\n${items}\n\nTotal: ${total}\n\nShipping address:\n${shippingAddress}\n\nI’ll prepare everything and follow up if I need any extra detail.\n\nLyesse\nNoisy by Nature`;

    const sent = await sendResendEmail(customerEmail, customerSubject, customerMessage);

    if (!sent) {
      console.warn("Customer order confirmation skipped: RESEND_API_KEY is not configured.", {
        sessionId: session.id,
        customerEmail,
      });
    }
  }
}

export async function notifyCheckoutIssue(session: Stripe.Checkout.Session, eventType: string) {
  const customer = session.customer_details;
  const customerEmail = customer?.email;
  const shippingDetails = session.collected_information?.shipping_details;
  const customerName = customer?.name || shippingDetails?.name || "Customer";
  const total = formatAmount(session.amount_total, session.currency);
  const customerPhone = customer?.phone || "n/a";

  const subject = `Noisy checkout issue — ${eventType}`;
  const message = `A Stripe Checkout session needs attention.\n\nEvent: ${eventType}\nSession: ${session.id}\nPayment intent: ${session.payment_intent ?? "n/a"}\nPayment status: ${session.payment_status}\nStatus: ${session.status}\nTotal: ${total}\nCustomer: ${customerName}\nEmail: ${customerEmail ?? "n/a"}\nPhone: ${customerPhone}\n\nStripe dashboard:\nhttps://dashboard.stripe.com/search?query=${encodeURIComponent(session.id)}`;

  const sellerNotifiedByResend = orderNotificationEmail
    ? await sendResendEmail(orderNotificationEmail, subject, message)
    : false;

  if (!sellerNotifiedByResend) {
    await sendSellerFormspreeNotification(subject, message, customerEmail);
  }
}
