import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const formspreeEndpoint =
  process.env.FORMSPREE_CONTACT_ENDPOINT?.trim() || "https://formspree.io/f/mnjyjjkw";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();

  if (!name || !email || !message || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please fill in a valid name, email, and message." }, { status: 400 });
  }

  try {
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Noisy by Nature contact - ${name}`,
        _replyto: email,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || "Formspree rejected the message.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to send the message right now." }, { status: 500 });
  }
}
