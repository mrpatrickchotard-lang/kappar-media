'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with newsletter service
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-24" style={{ background: 'var(--accent-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <span className="text-xs tracking-[0.3em] uppercase font-body mb-4 block" style={{ color: 'rgba(245,243,239,0.7)' }}>
          Stay Ahead
        </span>

        <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-6" style={{ color: '#f5f3ef' }}>
          The Briefing
        </h2>

        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'rgba(245,243,239,0.8)' }}>
          Weekly insights on business, technology, and the forces shaping global markets. No noise. No fluff.
        </p>

        {status === 'success' ? (
          <div className="rounded-xl p-6 max-w-md mx-auto" style={{ backgroundColor: 'rgba(245,243,239,0.1)', border: '1px solid rgba(245,243,239,0.3)' }}>
            <p className="font-body" style={{ color: '#f5f3ef' }}>You're subscribed. Welcome to The Briefing.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-4 rounded-xl font-body focus:outline-none transition-colors"
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(245,243,239,0.2)',
                color: '#f5f3ef',
              }}
            />
            <button
              type="submit"
              className="px-8 py-4 font-body font-medium rounded-xl transition-colors whitespace-nowrap"
              style={{
                backgroundColor: '#f5f3ef',
                color: 'var(--accent-primary)',
              }}
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-xs mt-6" style={{ color: 'rgba(245,243,239,0.5)' }}>
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
