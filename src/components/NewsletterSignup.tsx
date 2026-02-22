'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(errorMessage);
    }
  };

  return (
    <section className="relative py-28 overflow-hidden" style={{ background: 'var(--accent-primary)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'rgba(58,170,154,0.15)' }}></div>
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full" style={{ background: 'rgba(26,106,90,0.3)' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'rgba(42,138,122,0.08)', border: '1px solid rgba(245,243,239,0.05)' }}></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-8" style={{ backgroundColor: 'rgba(245,243,239,0.1)', border: '1px solid rgba(245,243,239,0.15)' }}>
          <svg className="w-6 h-6" style={{ color: '#f5f3ef' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <span className="text-xs tracking-[0.3em] uppercase font-body mb-4 block" style={{ color: 'rgba(245,243,239,0.6)' }}>
          Stay Ahead
        </span>

        <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-6" style={{ color: '#f5f3ef' }}>
          The Briefing
        </h2>

        <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(245,243,239,0.8)' }}>
          Weekly insights on business, technology, and the forces shaping global markets. No noise. No fluff.
        </p>

        {status === 'success' ? (
          <div className="rounded-2xl p-8 max-w-lg mx-auto" style={{ backgroundColor: 'rgba(245,243,239,0.1)', border: '1px solid rgba(245,243,239,0.2)' }}>
            <svg className="w-10 h-10 mx-auto mb-4" style={{ color: '#f5f3ef' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-display text-xl mb-2" style={{ color: '#f5f3ef' }}>You&apos;re in.</p>
            <p className="text-sm" style={{ color: 'rgba(245,243,239,0.7)' }}>Welcome to The Briefing. Check your inbox for the first edition.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-xl font-body text-base focus:outline-none transition-all focus:ring-2 focus:ring-white/20"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(245,243,239,0.2)',
                  color: '#f5f3ef',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-10 py-4 font-body font-medium rounded-xl transition-all whitespace-nowrap disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#f5f3ef',
                  color: 'var(--accent-primary)',
                }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-sm mt-3" style={{ color: 'rgba(255,200,200,0.9)' }}>{errorMsg}</p>
            )}
          </>
        )}

        <p className="text-xs mt-8" style={{ color: 'rgba(245,243,239,0.4)' }}>
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
