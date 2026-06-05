import { NextResponse } from "next/server";

type NewsletterPayload = {
  email?: string;
};

const formspreeEndpoint =
  process.env.FORMSPREE_CONTACT_ENDPOINT?.trim() || "https://formspree.io/f/mnjyjjkw";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(request: Request) {
  let payload: NewsletterPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  try {
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
      throw new Error(detail || "Formspree rejected the signup.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to join the list right now." }, { status: 500 });
  }
}
