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
    <section className="py-24 bg-[#0c2e2e]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <span className="text-[#4aba8a] text-xs tracking-[0.3em] uppercase font-body mb-4 block">
          Stay Ahead
        </span>
        
        <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide text-[#e8e4df] mb-6">
          The Briefing
        </h2>
        
        <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto mb-10">
          Weekly insights on business, technology, and the forces shaping global markets. No noise. No fluff.
        </p>
        
        {status === 'success' ? (
          <div className="bg-[#4aba8a]/10 border border-[#4aba8a]/30 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-[#4aba8a] font-body">You're subscribed. Welcome to The Briefing.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-4 bg-[#0a0a0a] border border-[#1a4a4a] rounded-xl text-[#e8e4df] placeholder-[#555] focus:outline-none focus:border-[#4aba8a] transition-colors font-body"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#c8c0a0] text-[#0c2e2e] font-body font-medium rounded-xl hover:bg-[#d8cdb8] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
        
        <p className="text-[#5a8a80] text-xs mt-6">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
