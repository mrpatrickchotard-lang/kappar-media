import Link from 'next/link';
import type { Partner } from '@/lib/partners';
import { PartnerLogo } from './PartnerLogo';

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

interface PartnerCardProps {
  partner: Partner;
  featured?: boolean;
}

export function PartnerCard({ partner, featured = false }: PartnerCardProps) {
  const typeColor = typeColors[partner.partnershipType] || typeColors.strategic;

  if (featured) {
    return (
      <Link href={`/partners/${partner.slug}`} className="group block">
        <div
          className="rounded-2xl overflow-hidden card-hover-light"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="grid md:grid-cols-[240px_1fr] gap-0">
            {/* Logo section */}
            <div
              className="flex items-center justify-center p-8 md:p-10"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRight: '1px solid var(--border-primary)',
              }}
            >
              <PartnerLogo name={partner.name} slug={partner.slug} size={140} />
            </div>

            {/* Content section */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase font-body px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: typeColor.bg,
                    color: typeColor.text,
                  }}
                >
                  {typeLabels[partner.partnershipType]}
                </span>
                <span
                  className="text-[10px] tracking-[0.15em] uppercase font-body"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {partner.industry}
                </span>
              </div>

              <h3
                className="font-display text-2xl font-light tracking-wide mb-2 group-hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                {partner.name}
              </h3>

              <p
                className="font-body text-sm leading-relaxed mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                {partner.description}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className="text-xs font-body"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {partner.headquarters}
                </span>
                <span style={{ color: 'var(--border-secondary)' }}>·</span>
                <span
                  className="text-xs font-body"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Partner since {partner.partnerSince}
                </span>
                {partner.employees && (
                  <>
                    <span style={{ color: 'var(--border-secondary)' }}>·</span>
                    <span
                      className="text-xs font-body"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {partner.employees} employees
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card variant
  return (
    <Link href={`/partners/${partner.slug}`} className="group block h-full">
      <div
        className="rounded-2xl overflow-hidden card-hover-light h-full flex flex-col"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        {/* Logo area */}
        <div
          className="flex items-center justify-center py-8 px-6"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <PartnerLogo name={partner.name} slug={partner.slug} size={96} />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <span
              className="text-[10px] tracking-[0.2em] uppercase font-body px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: typeColor.bg,
                color: typeColor.text,
              }}
            >
              {typeLabels[partner.partnershipType]}
            </span>
          </div>

          <h3
            className="font-display text-lg font-light tracking-wide mb-1.5 group-hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            {partner.name}
          </h3>

          <p
            className="text-[10px] tracking-[0.15em] uppercase font-body mb-2"
            style={{ color: 'var(--teal)' }}
          >
            {partner.industry}
          </p>

          <p
            className="font-body text-sm leading-relaxed mb-4 flex-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {partner.description.length > 120
              ? partner.description.slice(0, 120) + '...'
              : partner.description}
          </p>

          <div className="flex items-center gap-3 text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
            <span>{partner.headquarters}</span>
            <span style={{ color: 'var(--border-secondary)' }}>·</span>
            <span>Since {partner.partnerSince}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
