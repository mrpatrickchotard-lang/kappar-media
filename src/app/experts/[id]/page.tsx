import type { Metadata } from 'next';
import { getExpertById, getExperts } from '@/lib/expert-db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TagList } from '@/components/TagCloud';
import BookingCalendar from '@/components/BookingCalendar';
import { ExpertAvatar } from '@/components/ExpertAvatar';
import { expertJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';

interface ExpertPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const experts = await getExperts();
  return experts.map((expert) => ({
    id: expert.id,
  }));
}

export async function generateMetadata({ params }: ExpertPageProps): Promise<Metadata> {
  const { id } = await params;
  const expert = await getExpertById(id);
  if (!expert) return { title: 'Expert Not Found' };

  return {
    title: `${expert.name} — ${expert.title}`,
    description: expert.bio.slice(0, 160),
    openGraph: {
      title: `${expert.name} | Meet the Expert`,
      description: expert.bio.slice(0, 160),
      type: 'profile',
      url: `https://kappar.tv/experts/${expert.id}`,
    },
    twitter: {
      card: 'summary',
      title: `${expert.name} — ${expert.title}`,
      description: expert.bio.slice(0, 160),
    },
    alternates: {
      canonical: `https://kappar.tv/experts/${expert.id}`,
    },
  };
}

export default async function ExpertDetailPage({ params }: ExpertPageProps) {
  const { id } = await params;
  const expert = await getExpertById(id);

  if (!expert) {
    notFound();
  }

  const availableSlots = expert.availability.filter(s => !s.booked);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(expertJsonLd(expert)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
          { name: 'Home', url: 'https://kappar.tv' },
          { name: 'Experts', url: 'https://kappar.tv/experts' },
          { name: expert.name, url: `https://kappar.tv/experts/${expert.id}` },
        ])) }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Expert Info */}
          <div className="lg:col-span-2">
            <Link 
              href="/experts" 
              className="inline-flex items-center gap-2 text-sm text-tertiary hover:text-[var(--accent-gold)] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Experts
            </Link>
            
            <div className="flex items-start gap-6 mb-8">
              <ExpertAvatar name={expert.name} id={expert.id} size={96} />
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl font-light text-primary">{expert.name}</h1>
                  {expert.verified && (
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-emerald)]/20 flex items-center justify-center" title="Verified Expert">
                      <svg className="w-4 h-4 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <p className="text-secondary text-lg mb-1">{expert.title}</p>
                <p className="text-[var(--accent-gold)]">{expert.company}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <TagList tags={expert.expertise} />
            </div>
            
            <div className="prose prose-invert max-w-none mb-12">
              <h2 className="font-display text-xl font-light tracking-wide text-primary mb-4">About</h2>
              <p className="text-secondary leading-relaxed">{expert.bio}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-card border border-primary rounded-xl p-4 text-center">
                <p className="text-2xl font-light text-primary">{expert.rating}</p>
                <p className="text-xs text-tertiary uppercase tracking-wider">Rating</p>
              </div>
              <div className="bg-card border border-primary rounded-xl p-4 text-center">
                <p className="text-2xl font-light text-primary">{expert.reviewCount}</p>
                <p className="text-xs text-tertiary uppercase tracking-wider">Reviews</p>
              </div>
              <div className="bg-card border border-primary rounded-xl p-4 text-center">
                <p className="text-2xl font-light text-primary">{expert.totalCalls}</p>
                <p className="text-xs text-tertiary uppercase tracking-wider">Calls</p>
              </div>
              <div className="bg-card border border-primary rounded-xl p-4 text-center">
                <p className="text-2xl font-light text-primary">{expert.languages.length}</p>
                <p className="text-xs text-tertiary uppercase tracking-wider">Languages</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="font-display text-xl font-light tracking-wide text-primary mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {expert.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-primary rounded-full text-sm text-secondary">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-card border border-primary rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-3xl font-light text-primary">${expert.hourlyRate}</p>
                  <p className="text-sm text-tertiary">per hour</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-tertiary">{expert.currency}</p>
                </div>
              </div>
              
              <BookingCalendar expert={expert} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
