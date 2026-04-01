import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", {
  apiVersion: "2026-03-25.dahlia",
});

export async function createCheckoutSession(bookingId: string, amount: number) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ Missing STRIPE_SECRET_KEY, using stub checkout");
    return {
      url: `/payment/success?bookingId=${bookingId}&stub=true`,
      sessionId: "stub_session",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    client_reference_id: bookingId,
    metadata: { bookingId },
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Grand Haven Hotel Booking",
            description: `Booking Reference: ${bookingId}`,
          },
          unit_amount: amount * 100, // paise
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment/failed`,
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
}
