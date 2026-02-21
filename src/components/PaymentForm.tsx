'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { format, parseISO } from 'date-fns';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ bookingId, totalAmount }: { bookingId: string; totalAmount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/success?booking=${bookingId}`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 accent-primary text-[var(--accent-gold)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${totalAmount}`}
      </button>
    </form>
  );
}

export default function PaymentPage({ 
  clientSecret, 
  bookingId, 
  totalAmount,
  expert,
  slot
}: { 
  clientSecret: string; 
  bookingId: string; 
  totalAmount: number;
  expert: any;
  slot: any;
}) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#4aba8a',
        colorBackground: '#0f0f12',
        colorText: '#e8e4df',
        colorDanger: '#c45a5a',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Complete Payment</h1>
          <p className="text-secondary mt-2">Secure payment processed by Stripe</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-primary rounded-2xl p-6">
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm bookingId={bookingId} totalAmount={totalAmount} />
            </Elements>
          </div>

          <div className="bg-card border border-primary rounded-2xl p-6">
            <h3 className="font-display text-lg text-primary mb-4">Booking Summary</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full accent-primary flex items-center justify-center">
                <span className="text-lg text-[var(--accent-gold)] font-display">{expert.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-primary font-medium">{expert.name}</p>
                <p className="text-sm text-tertiary">{expert.title}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-tertiary">Date</span>
                <span className="text-primary">{format(parseISO(slot.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Time</span>
                <span className="text-primary">{slot.startTime} - {slot.endTime}</span>
              </div>
            </div>

            <div className="border-t border-primary mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Total</span>
                <span className="text-2xl font-light text-primary">${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
