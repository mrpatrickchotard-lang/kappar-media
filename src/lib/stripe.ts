import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // @ts-expect-error - Stripe SDK version may differ from latest API version
      apiVersion: '2024-12-18.acacia',
    });
  }
  return _stripe;
}

export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: Record<string, string> = {}) {
  return getStripe().paymentIntents.create({
    amount: amount * 100,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function capturePayment(paymentIntentId: string) {
  return getStripe().paymentIntents.capture(paymentIntentId);
}

export async function cancelPayment(paymentIntentId: string) {
  return getStripe().paymentIntents.cancel(paymentIntentId);
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  return getStripe().refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? amount * 100 : undefined,
  });
}

