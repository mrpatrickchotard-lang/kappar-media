import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPartners, getPartnerBySlug, getRelatedPartners } from '@/lib/partners';
import { PartnerLogoLarge } from '@/components/PartnerLogo';
import { PartnerCard } from '@/components/PartnerCard';
import { sanitizeHtml } from '@/lib/sanitize';

export async function generateStaticParams() {
  const partners = await getAllPartners();
  return partners.map((partner) => ({ slug: partner.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) return { title: 'Partner Not Found | Kappar Media' };
  return {
    title: `${partner.name} — Partner`,
    description: partner.description,
    openGraph: {
      title: `${partner.name} | Kappar Media`,
      description: partner.description,
      url: `https://kappar.tv/partners/${partner.slug}`,
    },
    twitter: {
      card: 'summary',
      title: `${partner.name} | Kappar Media`,
      description: partner.description,
    },
    alternates: {
      canonical: `https://kappar.tv/partners/${partner.slug}`,
    },
  };
}

const typeLabels: Record<string, string> = {
  strategic: 'Strategic Partner',
  technology: 'Technology Partner',
  media: 'Media Partner',
  consulting: 'Consulting Partner',
};

const typeColors: Record<string, { bg: string; text: string }> = {
  strategic: { bg: 'rgba(42,138,122,0.12)', text: 'var(--teal)' },
  technology: { bg: 'rgba(58,170,154,0.12)', text: 'var(--accent-emerald)' },
  media: { bg: 'rgba(212,160,48,0.12)', text: '#b8941e' },
  consulting: { bg: 'rgba(100,120,140,0.12)', text: 'var(--text-secondary)' },
};

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) notFound();

  const related = await getRelatedPartners(slug, 3);
  const typeColor = typeColors[partner.partnershipType] || typeColors.strategic;

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 font-body text-sm mb-10 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Partners
        </Link>

        {/* Header section */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-12 mb-16">
          <div>
            {/* Logo + Name */}
            <div className="flex items-start gap-6 mb-6">
              <PartnerLogoLarge name={partner.name} slug={partner.slug} size={100} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase font-body px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: typeColor.bg,
                      color: typeColor.text,
                    }}
                  >
                    {typeLabels[partner.partnershipType]}
                  </span>
                </div>
                <h1
                  className="font-display text-3xl md:text-4xl font-light tracking-wide mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {partner.name}
                </h1>
                <p
                  className="text-xs tracking-[0.15em] uppercase font-body"
                  style={{ color: 'var(--teal)' }}
                >
                  {partner.industry}
                </p>
              </div>
            </div>

            {/* Description */}
            <p
              className="font-body text-base leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              {partner.description}
            </p>

            {/* Quick info */}
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { label: 'Headquarters', value: partner.headquarters },
                { label: 'Founded', value: partner.founded },
                { label: 'Team Size', value: partner.employees },
                { label: 'Partner Since', value: partner.partnerSince },
              ].map(item => (
                <div key={item.label}>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase font-body mb-0.5"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="font-body text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Key Highlights */}
          <div
            className="rounded-2xl p-6 h-fit lg:sticky lg:top-28"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <h3
              className="font-display text-lg font-light tracking-wide mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Key Highlights
            </h3>

            <div className="space-y-3 mb-6">
              {partner.keyHighlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(42,138,122,0.12)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p
                    className="font-body text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {highlight}
                  </p>
                </div>
              ))}
            </div>

            {/* Services */}
            <h4
              className="text-[10px] tracking-[0.2em] uppercase font-body mb-3"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Services
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {partner.services.map(service => (
                <span
                  key={service}
                  className="text-xs font-body px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  {service}
                </span>
              ))}
            </div>

            {/* Website CTA */}
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center font-body text-sm py-3 rounded-xl transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
              }}
            >
              Visit Website
            </a>

            {/* Social Links */}
            {(partner.socialLinks.linkedin || partner.socialLinks.twitter) && (
              <div className="flex items-center justify-center gap-4 mt-4">
                {partner.socialLinks.linkedin && (
                  <a
                    href={partner.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {partner.socialLinks.twitter && (
                  <a
                    href={partner.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Partnership Content */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-12 mb-20">
          <div>
            {/* About the Partnership */}
            <div className="mb-12">
              <h2
                className="font-display text-2xl font-light tracking-wide mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                About the Partnership
              </h2>
              <div
                className="font-body text-base leading-relaxed prose-kappar"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(partner.longDescription) }}
              />
            </div>

            {/* Collaboration Areas */}
            <div>
              <h2
                className="font-display text-2xl font-light tracking-wide mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                How We Collaborate
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {partner.collaborationAreas.map((area, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: 'rgba(42,138,122,0.12)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)' }}>
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <p
                      className="font-body text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {area}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empty right column to maintain grid alignment with sidebar above */}
          <div />
        </div>

        {/* Related Partners */}
        {related.length > 0 && (
          <div
            className="pt-12"
            style={{ borderTop: '1px solid var(--border-primary)' }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2
                className="font-display text-2xl font-light tracking-wide"
                style={{ color: 'var(--text-primary)' }}
              >
                More Partners
              </h2>
              <Link
                href="/partners"
                className="font-body text-sm transition-opacity hover:opacity-70"
                style={{ color: 'var(--teal)' }}
              >
                View All Partners →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
