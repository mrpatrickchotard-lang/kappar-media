import { NewsletterSignup } from '@/components/NewsletterSignup';

export default function NewsletterPage() {
  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-xs tracking-[0.3em] uppercase font-body mb-4 block" style={{ color: 'var(--teal)' }}>
            Newsletter
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-6" style={{ color: 'var(--text-primary)' }}>
            The Briefing
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Weekly insights on business, technology, and the forces shaping global markets.
            Curated for decision-makers who need to stay ahead.
          </p>
        </div>
      </div>
      <NewsletterSignup />
      <div className="py-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.15)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-light tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>Weekly Delivery</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Every Monday morning. Start your week informed.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.15)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-light tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>Curated Content</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Signal, not noise. Only what matters.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.15)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-light tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>No Spam, Ever</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Unsubscribe anytime. We respect your inbox.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
