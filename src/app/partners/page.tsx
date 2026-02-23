import type { Metadata } from 'next';
import { getAllPartners, getFeaturedPartners, getPartnersByType, getPartnershipTypes } from '@/lib/partners';
import { PartnerCard } from '@/components/PartnerCard';

export const metadata: Metadata = {
  title: 'Our Partners',
  description: 'Meet the corporate partners powering Kappar Media. From strategic advisors to technology providers, our partners help us deliver world-class content and events.',
  openGraph: {
    title: 'Our Partners | Kappar Media',
    description: 'Meet the corporate partners powering Kappar Media.',
    url: 'https://kappar.tv/partners',
  },
  alternates: {
    canonical: 'https://kappar.tv/partners',
  },
};

const typeLabels: Record<string, string> = {
  strategic: 'Strategic',
  technology: 'Technology',
  media: 'Media',
  consulting: 'Consulting',
};

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const selectedType = params.type || '';

  const allPartners = selectedType
    ? getPartnersByType(selectedType)
    : getAllPartners();

  const featuredPartners = !selectedType ? getFeaturedPartners() : [];
  const nonFeaturedPartners = !selectedType
    ? allPartners.filter(p => !p.featured)
    : allPartners;

  const types = getPartnershipTypes();

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-xs tracking-[0.3em] uppercase font-body mb-4"
            style={{ color: 'var(--teal)' }}
          >
            OUR NETWORK
          </p>
          <h1
            className="font-display text-4xl md:text-5xl font-light tracking-wide mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Partners
          </h1>
          <p
            className="font-body text-lg max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            We collaborate with leading organizations across the MENA region to deliver exceptional content, events, and insights for business leaders.
          </p>
        </div>

        {/* Type Filters */}
        <div className="flex items-center gap-3 mb-12 flex-wrap">
          <a
            href="/partners"
            className="px-4 py-2 rounded-full text-sm font-body transition-all"
            style={{
              backgroundColor: !selectedType ? 'var(--accent-primary)' : 'transparent',
              color: !selectedType ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${!selectedType ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
            }}
          >
            All Partners
          </a>
          {types.map(type => (
            <a
              key={type}
              href={`/partners?type=${type}`}
              className="px-4 py-2 rounded-full text-sm font-body transition-all"
              style={{
                backgroundColor: selectedType === type ? 'var(--accent-primary)' : 'transparent',
                color: selectedType === type ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${selectedType === type ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
              }}
            >
              {typeLabels[type]}
            </a>
          ))}
        </div>

        {/* Featured Partners */}
        {featuredPartners.length > 0 && (
          <div className="mb-12">
            <p
              className="text-xs tracking-[0.2em] uppercase font-body mb-6"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Featured Partners
            </p>
            <div className="space-y-6">
              {featuredPartners.map(partner => (
                <PartnerCard key={partner.id} partner={partner} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Partners Grid */}
        {nonFeaturedPartners.length > 0 && (
          <div>
            {!selectedType && featuredPartners.length > 0 && (
              <p
                className="text-xs tracking-[0.2em] uppercase font-body mb-6"
                style={{ color: 'var(--text-tertiary)' }}
              >
                All Partners
              </p>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nonFeaturedPartners.map(partner => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {allPartners.length === 0 && (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="font-body" style={{ color: 'var(--text-tertiary)' }}>
              No partners found for this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
