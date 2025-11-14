import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// ⚠️ Tarifs officiels Stripe
const SHIPPING_FR = "shr_1ST4DsChL5cUM7Rg9TPX5Wd4";         // France – 18 €
const SHIPPING_EU = "shr_1ST45XChL5cUM7RgDck476FR";         // Europe – 25 €
const SHIPPING_UK = "shr_1ST9XPChL5cUM7RgX25h9zWF";         // UK – 29 €
const SHIPPING_WORLD = "shr_1ST9PYChL5cUM7RgYfmaK8F5";      // World – 59 €

export async function POST(req: Request) {
  try {
    const { priceId, shippingCountry } = await req.json();

    console.log("BACKEND → priceId =", priceId);
    console.log("BACKEND → shippingCountry =", shippingCountry);

    // Par défaut → WORLD
    let shippingRate = SHIPPING_WORLD;

    // Liste complète UE
    const EU_COUNTRIES = [
      "BE", "DE", "IT", "ES", "NL", "PT", "AT",
      "DK", "SE", "FI",
      "CH", // Suisse (UE élargie)
      "PL", "LT", "LV", "EE", "RO" // Ajouts demandés
    ];

    if (shippingCountry === "FR") {
      shippingRate = SHIPPING_FR;
    } else if (EU_COUNTRIES.includes(shippingCountry)) {
      shippingRate = SHIPPING_EU;
    } else if (shippingCountry === "GB") {
      shippingRate = SHIPPING_UK; // UK à 29 €
    }

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://noisybynature.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: [
          "FR",

          // Europe complète
          "BE","DE","IT","ES","NL","PT","AT",
          "DK","SE","FI",
          "CH",
          "PL","LT","LV","EE","RO",

          // UK
          "GB",

          // Monde
          "US","CA","AU","JP","HK","SG"
        ],
      },

      shipping_options: [{ shipping_rate: shippingRate }],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
