import { NextResponse } from "next/server";

type BespokeRequestPayload = {
  email?: string;
  notes?: string;
  estimatedPrice?: number;
  configuration?: {
    format?: string;
    hp?: number;
    rows3U?: number;
    has1U?: boolean;
    tolex?: string;
    rails?: string;
    caseHeight?: string;
    lid?: boolean;
    vesa?: boolean;
    feet?: boolean;
    powerSupply?: boolean;
    busboards?: number;
  };
};

const booleanLabel = (value?: boolean) => (value ? "yes" : "no");
const formspreeEndpoint =
  process.env.FORMSPREE_CONTACT_ENDPOINT?.trim() || "https://formspree.io/f/mnjyjjkw";

const formatEmailText = (payload: BespokeRequestPayload) => {
  const configuration = payload.configuration || {};

  return [
    "Bespoke Eurorack case request",
    "",
    `Email: ${payload.email}`,
    `Estimated price: EUR ${payload.estimatedPrice}`,
    "",
    "Configuration",
    `Format: ${configuration.format || "-"}`,
    `HP: ${configuration.hp || "-"}`,
    `3U rows: ${configuration.rows3U || "-"}`,
    `1U row: ${booleanLabel(configuration.has1U)}`,
    `Tolex: ${configuration.tolex || "-"}`,
    `Rails: ${configuration.rails || "-"}`,
    `Case height: ${configuration.caseHeight || "-"}`,
    `Lid: ${booleanLabel(configuration.lid)}`,
    `VESA mount: ${booleanLabel(configuration.vesa)}`,
    `Retractable feet: ${booleanLabel(configuration.feet)}`,
    `Meanwell RT-65B power supply: ${booleanLabel(configuration.powerSupply)}`,
    `Bus boards: ${configuration.busboards ?? "-"}`,
    "",
    "Notes",
    payload.notes?.trim() || "-",
    "",
    "Final quote to be confirmed manually after workshop review.",
  ].join("\n");
};

export async function POST(request: Request) {
  let payload: BespokeRequestPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload.email || !payload.email.includes("@") || !payload.estimatedPrice || !payload.configuration) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const subject = `Bespoke case request - ${payload.configuration.hp}hp ${payload.configuration.format}`;
  const body = formatEmailText(payload);

  try {
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        message: body,
        _subject: subject,
        _replyto: payload.email,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || "Formspree rejected the request.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to send the request right now." }, { status: 500 });
  }
}
