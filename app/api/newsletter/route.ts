import { NextResponse } from "next/server";

type NewsletterPayload = {
  email?: string;
};

const formspreeEndpoint =
  process.env.FORMSPREE_CONTACT_ENDPOINT?.trim() || "https://formspree.io/f/mnjyjjkw";
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY?.trim();
const MAILERLITE_API_BASE = (process.env.MAILERLITE_API_URL ?? "https://connect.mailerlite.com/api").replace(
  /\/$/,
  "",
);
const MAILERLITE_NEWSLETTER_GROUP = process.env.MAILERLITE_GROUP_NEWSLETTER?.trim();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function formatMailerLiteError(data: Record<string, unknown>): string {
  const msg = data.message;
  if (typeof msg === "string" && msg.length) return msg;

  const errors = data.errors;
  if (errors && typeof errors === "object") {
    const parts = Object.entries(errors as Record<string, unknown>).flatMap(([k, v]) => {
      if (Array.isArray(v)) return [`${k}: ${v.join(", ")}`];
      if (typeof v === "string") return [`${k}: ${v}`];
      return [];
    });
    if (parts.length) return parts.join(" ");
  }

  return "MailerLite failed to subscribe this email.";
}

async function notifyFormspree(email: string) {
  const response = await fetch(formspreeEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      message: "Newsletter signup",
      _subject: "Noisy by Nature newsletter signup",
      _replyto: email,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[NEWSLETTER API] Formspree notification failed", response.status, detail.slice(0, 500));
  }
}

export async function POST(request: Request) {
  let payload: NewsletterPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (!MAILERLITE_API_KEY) {
    return NextResponse.json({ error: "MailerLite API key not configured." }, { status: 500 });
  }

  try {
    const subscriberPayload = MAILERLITE_NEWSLETTER_GROUP
      ? { email, groups: [MAILERLITE_NEWSLETTER_GROUP] }
      : { email };

    const response = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriberPayload),
    });

    const raw = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      /**/
    }

    if (response.status !== 201 && response.status !== 200) {
      const errorText = formatMailerLiteError(data);
      console.error("[NEWSLETTER API] MailerLite error", response.status, errorText, raw.slice(0, 500));
      return NextResponse.json({ error: errorText }, { status: response.status >= 400 ? response.status : 502 });
    }

    await notifyFormspree(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NEWSLETTER API]", error);
    return NextResponse.json({ error: "Unable to join the list right now." }, { status: 500 });
  }
}
