import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: Record<string, string> = {}) {
  return stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function capturePayment(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId);
}

export async function cancelPayment(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId);
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? amount * 100 : undefined,
  });
}
