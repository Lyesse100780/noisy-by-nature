import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getShopProduct, type ShopProduct } from "@/lib/shop-products";
import { getShippingCountry, getShippingOptions, type ShippingMethodId } from "@/lib/shipping";

type CheckoutItem = {
  slug: string;
  quantity?: number;
};

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const body = (await request.json()) as {
      items?: CheckoutItem[];
      shipping?: {
        countryCode?: string;
        methodId?: ShippingMethodId;
      };
    };
    const rawItems = Array.isArray(body.items) ? body.items : [];

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const shippingProducts: ShopProduct[] = [];

    for (const item of rawItems) {
      const product = getShopProduct(item.slug);
      if (!product || !product.available || product.priceAmount <= 0) continue;

      const image = product.images[0] ? new URL(product.images[0], siteUrl).toString() : undefined;
      const quantity = Math.max(1, Math.min(9, Number(item.quantity) || 1));

      if (quantity > product.stockQuantity) {
        return NextResponse.json(
          { error: `${product.name} is limited to ${product.stockQuantity} in stock.` },
          { status: 400 },
        );
      }

      lineItems.push({
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.priceAmount,
          product_data: {
            name: product.name,
            images: image ? [image] : undefined,
            metadata: {
              slug: product.slug,
            },
          },
        },
      });

      for (let index = 0; index < quantity; index += 1) {
        shippingProducts.push(product);
      }
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No available products in cart." }, { status: 400 });
    }

    const countryCode = body.shipping?.countryCode ?? "FR";
    const methodId = body.shipping?.methodId;
    const country = getShippingCountry(countryCode);

    if (!country || !methodId) {
      return NextResponse.json({ error: "Shipping destination is required." }, { status: 400 });
    }

    const shippingOption = getShippingOptions(country.code, shippingProducts).find((option) => option.id === methodId);

    if (!shippingOption) {
      return NextResponse.json({ error: "Selected shipping method is not available." }, { status: 400 });
    }

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: shippingOption.amount,
        product_data: {
          name: `Shipping - ${shippingOption.label}`,
          metadata: {
            country: country.code,
            method: shippingOption.id,
          },
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: [
          country.code as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry,
        ],
      },
      success_url: `${siteUrl}/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        source: "noisy-by-nature-shop",
        slugs: rawItems.map((item) => item.slug).join(","),
        shippingCountry: country.code,
        shippingMethod: shippingOption.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe checkout error", {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      console.error("Stripe checkout error", error);
    }
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}
