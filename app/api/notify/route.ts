import { NextRequest, NextResponse } from "next/server";

/**
 * MailerLite (current product): Bearer token + https://connect.mailerlite.com/api
 * Docs: POST /subscribers with { email, groups: [ "<group-id>" ] } (groups are additive).
 *
 * Legacy Classic API (api.mailerlite.com/api/v2) does not accept tokens from new accounts.
 */

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY?.trim();
const MAILERLITE_API_BASE = (process.env.MAILERLITE_API_URL ?? "https://connect.mailerlite.com/api").replace(
  /\/$/,
  "",
);

const productGroupMap: Record<string, string> = {
  fad3rs: process.env.MAILERLITE_GROUP_FAD3RS?.trim() ?? "",
  mast3r: process.env.MAILERLITE_GROUP_MAST3R?.trim() ?? "",
  cables: process.env.MAILERLITE_GROUP_CABLES?.trim() ?? "",
};

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
  return "Failed to subscribe";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, product } = body as { email?: string; product?: string };

    if (!email || !product || typeof email !== "string" || typeof product !== "string") {
      return NextResponse.json({ error: "Email and product are required" }, { status: 400 });
    }

    if (!MAILERLITE_API_KEY) {
      return NextResponse.json({ error: "MailerLite API key not configured" }, { status: 500 });
    }

    const productKey = product.toLowerCase().trim();
    const groupId = productGroupMap[productKey];

    if (!groupId) {
      const envHint = productKey.replace(/[^a-z0-9]/gi, "").toUpperCase();
      return NextResponse.json(
        {
          error: `No MailerLite group configured for "${product}". Set MAILERLITE_GROUP_${envHint || productKey.toUpperCase()} with the group ID from Dashboard → Subscribers → Groups.`,
        },
        { status: 400 },
      );
    }

    const url = `${MAILERLITE_API_BASE}/subscribers`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        groups: [groupId],
      }),
    });

    const raw = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      /**/
    }

    if (response.status === 201 || response.status === 200) {
      return NextResponse.json({ success: true, message: "Subscribed to product notifications" }, { status: 200 });
    }

    const errorText = formatMailerLiteError(data);
    console.error("[NOTIFY API] MailerLite error", response.status, errorText, raw.slice(0, 500));

    return NextResponse.json(
      {
        error: errorText || `MailerLite returned ${response.status}`,
      },
      { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
    );
  } catch (error) {
    console.error("[NOTIFY API]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
