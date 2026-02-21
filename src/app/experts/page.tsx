import { getExperts } from '@/lib/expert-db';
import Link from 'next/link';
import { TagList } from '@/components/TagCloud';

export default function ExpertsPage() {
  const experts = getExperts();
  const featuredExperts = experts.filter(e => e.featured);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase font-body mb-4 block" style={{ color: 'var(--teal)' }}>
            Expert Network
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-6" style={{ color: 'var(--text-primary)' }}>
            Meet the Experts
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Book one-on-one sessions with industry leaders, operators, and specialists.
          </p>
        </div>

        {/* Featured Experts */}
        {featuredExperts.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-2xl font-light tracking-wide mb-8" style={{ color: 'var(--text-primary)' }}>Featured Experts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Experts */}
        <div>
          <h2 className="font-display text-2xl font-light tracking-wide mb-8" style={{ color: 'var(--text-primary)' }}>All Experts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpertCard({ expert, featured = false }: { expert: any; featured?: boolean }) {
  return (
    <Link href={`/experts/${expert.id}`} className="group block">
      <article
        className={`rounded-2xl p-6 transition-all h-full flex flex-col card-hover ${
          featured ? 'ring-1 ring-[var(--teal)]/20' : ''
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span className="text-2xl font-display" style={{ color: '#f5f3ef' }}>{expert.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-light group-hover:text-[var(--teal)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                {expert.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{expert.location}</p>
            </div>
          </div>

          {expert.verified && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,138,122,0.2)' }} title="Verified Expert">
              <svg className="w-4 h-4" style={{ color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{expert.title} at {expert.company}</p>

        <p className="text-sm line-clamp-2 mb-4 flex-grow" style={{ color: 'var(--text-tertiary)' }}>{expert.bio}</p>

        <div className="mb-4">
          <TagList tags={expert.expertise} size="sm" />
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" style={{ color: 'var(--teal)' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{expert.rating}</span>
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>({expert.reviewCount})</span>
          </div>

          <div className="text-right">
            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>${expert.hourlyRate}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>per hour</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
