import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'About',
  description: 'Kappar Media is a forward media platform connecting business leaders with expert insights, events, and analysis from Dubai to the world.',
  openGraph: {
    title: 'About Kappar Media',
    description: 'Forward media for business leaders. Expert insights, events, and analysis from Dubai to the world.',
    url: 'https://kappar.tv/about',
  },
  alternates: {
    canonical: 'https://kappar.tv/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase font-body mb-4 block" style={{ color: 'var(--teal)' }}>
            About Us
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-6" style={{ color: 'var(--text-primary)' }}>
            Forward Media
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Where business leaders find their edge.
          </p>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-16">
          <Logo variant="teal" size={120} />
        </div>

        {/* Story */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="rounded-2xl p-8 md:p-12 mb-12" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <h2 className="font-display text-2xl font-light tracking-wide mb-6" style={{ color: 'var(--text-primary)' }}>
              Our Story
            </h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Kappar Media was founded in Dubai with a simple belief: the business world moves fast,
              and decision-makers need media that keeps pace. In an era of information overload,
              we curate signal from noise—delivering insights that matter to leaders who shape industries.
            </p>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Based in the Dubai International Financial Centre, we operate at the intersection of
              global finance, emerging technology, and evolving markets. Our perspective is rooted
              in the Middle East but our reach is worldwide. We cover the forces reshaping business:
              fintech innovation, AI transformation, shifting consumer behavior, and the new geography of opportunity.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              What sets us apart is access. Through our network of operators, founders, and investors,
              we bring perspectives you won't find in mainstream outlets. Our content is built on
              conversations with people building the future—not just observing it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.15)' }}>
                <svg className="w-7 h-7" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-light tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>Original Content</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Articles, interviews, and analysis from our editorial team and contributor network.</p>
            </div>
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.15)' }}>
                <svg className="w-7 h-7" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-light tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>Expert Access</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Direct conversations with industry leaders through our curated expert network.</p>
            </div>
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.15)' }}>
                <svg className="w-7 h-7" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-light tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>Global Reach</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dubai-based perspective with worldwide coverage and audience.</p>
            </div>
          </div>
          <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <h2 className="font-display text-2xl font-light tracking-wide mb-6" style={{ color: 'var(--text-primary)' }}>
              What We Believe
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--teal)' }}></div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Depth Over Volume</h4>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>One well-researched piece beats ten rushed posts. We prioritize substance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--teal)' }}></div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Access Matters</h4>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>The best insights come from people in the arena, not the stands. We cultivate those relationships.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--teal)' }}></div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Context is Everything</h4>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Markets don't move in isolation. We connect dots across regions and industries.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--teal)' }}></div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Forward-Looking</h4>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>We cover what's next, not just what's now. Our audience wants to see around corners.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 font-body rounded-xl transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#f5f3ef',
              border: '1px solid var(--teal-light, #3aaa9a)',
            }}
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
