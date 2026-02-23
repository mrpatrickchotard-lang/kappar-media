'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  hourlyRate: number;
  availability: AvailabilitySlot[];
}

interface BookingFormData {
  name: string;
  email: string;
  company: string;
  topic: string;
}

interface BookingApiError {
  error?: string;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { expertId } = useParams<{ expertId: string }>();
  const slotId = searchParams.get('slot');

  const [expert, setExpert] = useState<Expert | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const slot = expert?.availability?.find((s) => s.id === slotId) || null;

  useEffect(() => {
    fetch(`/api/experts-manage?public=true`)
      .then(res => res.json())
      .then(data => {
        const experts = data.experts || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = experts.find((e: any) => e.id === expertId || e.expertId === expertId);
        setExpert(found || null);
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, [expertId]);

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    company: '',
    topic: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (pageLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!expert || !slot) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-primary mb-4">Booking not found</h1>
          <button
            onClick={() => router.push('/experts')}
            className="text-[var(--accent-emerald)] hover:underline"
          >
            Back to Experts
          </button>
        </div>
      </div>
    );
  }

  const DURATION_MINUTES = 60;
  const totalAmount = expert.hourlyRate;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId: expert.id,
          slotId: slot.id,
          clientName: formData.name,
          clientEmail: formData.email,
          clientCompany: formData.company,
          topic: formData.topic,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          hourlyRate: expert.hourlyRate,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as BookingApiError;
        throw new Error(data.error || 'Failed to create booking');
      }

      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Complete Your Booking</h1>
          <p className="text-secondary mt-2">Enter your details to confirm the session</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-card border border-primary rounded-2xl p-6">
            {success ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(42,138,122,0.2)' }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: 'var(--teal, #2a8a7a)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-light tracking-wide text-primary mb-3">
                  Booking Confirmed
                </h3>
                <p className="text-secondary mb-6">
                  We've sent a confirmation to your email. You'll receive meeting details shortly.
                </p>
                <button
                  onClick={() => router.push('/experts')}
                  className="px-6 py-3 rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }}
                >
                  Back to Experts
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="p-4 rounded-xl text-sm"
                    style={{
                      backgroundColor: 'rgba(196,90,90,0.1)',
                      border: '1px solid rgba(196,90,90,0.3)',
                      color: '#c45a5a',
                    }}
                  >
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-secondary mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-2">What would you like to discuss? *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)] resize-none"
                    placeholder="Brief description of what you'd like to cover..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }}
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-card border border-primary rounded-2xl p-6">
              <h3 className="font-display text-lg text-primary mb-4">Session Details</h3>

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
                  <span className="text-primary">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tertiary">Duration</span>
                  <span className="text-primary">{DURATION_MINUTES} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tertiary">Location</span>
                  <span className="text-primary">Video Call</span>
                </div>
              </div>

              <div className="border-t border-primary mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Total</span>
                  <span className="text-2xl font-light text-primary">${totalAmount}</span>
                </div>
                <p className="text-xs text-tertiary mt-2">
                  You will be charged pro-rata based on actual call duration
                </p>
              </div>
            </div>

            <div
              className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)] rounded-2xl p-6"
            >
              <h4 className="text-sm font-medium text-[var(--accent-gold)] mb-2">What's included</h4>
              <ul className="space-y-2 text-sm text-secondary">
                {['1-on-1 video session', 'Recording (if agreed)', 'Follow-up notes', 'Secure payment'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[var(--accent-emerald)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
