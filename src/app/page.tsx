import Link from 'next/link';
import { getFeaturedArticles, getLatestArticles } from '@/lib/content';
import { getUpcomingEvents } from '@/lib/events';
import { getAllPartners } from '@/lib/partners';
import { ArticleCard } from '@/components/ArticleCard';
import { EventCard } from '@/components/EventCard';
import { PartnerLogo } from '@/components/PartnerLogo';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Logo } from '@/components/Logo';
import { CategoryIcon } from '@/components/CategoryIcon';

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles();
  const latestArticles = await getLatestArticles(6);
  const upcomingEvents = getUpcomingEvents(3);
  const partners = getAllPartners();

  const heroArticle = featuredArticles[0];
  const otherFeatured = featuredArticles.slice(1, 3);

  return (
    <div className="min-h-screen">
      {/* Hero with animated gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0" style={{ background: 'var(--bg-primary)' }}>
          <div className="hero-gradient-animate absolute inset-0"></div>
          <div className="hero-orb hero-orb-1 absolute w-[500px] h-[500px] rounded-full blur-3xl"></div>
          <div className="hero-orb hero-orb-2 absolute w-[400px] h-[400px] rounded-full blur-3xl"></div>
          <div className="hero-orb hero-orb-3 absolute w-[300px] h-[300px] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-12">
            <Logo variant="teal" size={80} />
          </div>

          <p className="text-sm tracking-[0.4em] uppercase font-body mb-6" style={{ color: 'var(--teal)' }}>
            Forward Media
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-8" style={{ color: 'var(--text-primary)' }}>
            KAPPAR
          </h1>

          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/content"
              className="px-8 py-4 font-body rounded-xl transition-all border hover:shadow-lg hover:shadow-[var(--teal)]/20 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#f5f3ef',
                borderColor: 'var(--teal-light, #3aaa9a)',
              }}
            >
              Explore Content
            </Link>
            <Link
              href="/newsletter"
              className="px-8 py-4 bg-transparent font-body rounded-xl transition-all border hover:border-[var(--teal)] hover:-translate-y-0.5"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'var(--border-secondary)',
              }}
            >
              Subscribe
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full flex justify-center" style={{ border: '2px solid var(--border-secondary)' }}>
            <div className="w-1 h-2 rounded-full mt-2 animate-bounce" style={{ background: 'var(--teal)' }}></div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase font-body mb-2 block" style={{ color: 'var(--teal)' }}>
                Featured
              </span>
              <h2 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
                Latest Insights
              </h2>
            </div>
            <Link href="/content" className="text-sm transition-colors hover:text-[var(--teal)]" style={{ color: 'var(--text-secondary)' }}>
              View All →
            </Link>
          </div>

          {heroArticle && (
            <div className="mb-12">
              <ArticleCard article={heroArticle} featured={true} />
            </div>
          )}

          {otherFeatured.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {otherFeatured.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories with SVG icons */}
      <section className="py-24 border-y" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase font-body mb-2 block" style={{ color: 'var(--teal)' }}>
              Coverage
            </span>
            <h2 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
              What We Cover
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Tech', desc: 'AI, fintech & digital innovation' },
              { name: 'Business', desc: 'Strategy, leadership & growth' },
              { name: 'Marketing', desc: 'Branding, content & reach' },
              { name: 'Lifestyle', desc: 'Wellness, travel & balance' },
              { name: 'Real Estate', desc: 'Property, development & investment' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/content?category=${category.name.toLowerCase()}`}
                className="group p-8 rounded-2xl transition-all text-center card-hover-light"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: 'rgba(42,138,122,0.15)' }}
                >
                  <CategoryIcon category={category.name} size={28} className="text-[var(--teal)]" />
                </div>
                <h3 className="font-display text-lg font-light tracking-wide transition-colors mb-1" style={{ color: 'var(--text-primary)' }}>
                  {category.name}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {category.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-24" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase font-body mb-2 block" style={{ color: 'var(--teal)' }}>
                  Events
                </span>
                <h2 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Upcoming Events
                </h2>
              </div>
              <Link href="/events" className="text-sm transition-colors hover:text-[var(--teal)]" style={{ color: 'var(--text-secondary)' }}>
                View All Events →
              </Link>
            </div>

            {/* Featured event */}
            {upcomingEvents[0] && (
              <div className="mb-8">
                <EventCard event={upcomingEvents[0]} featured />
              </div>
            )}

            {/* Other upcoming events */}
            {upcomingEvents.length > 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingEvents.slice(1, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="py-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase font-body mb-2 block" style={{ color: 'var(--teal)' }}>
                Recent
              </span>
              <h2 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
                More Stories
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      {partners.length > 0 && (
        <section className="py-24 border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.3em] uppercase font-body mb-2 block" style={{ color: 'var(--teal)' }}>
                Our Network
              </span>
              <h2 className="font-display text-3xl font-light tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
                Trusted Partners
              </h2>
              <p className="font-body text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
                We collaborate with leading organizations to deliver exceptional insights and experiences.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap mb-8">
              {partners.slice(0, 7).map((partner) => (
                <Link
                  key={partner.id}
                  href={`/partners/${partner.slug}`}
                  className="group transition-all hover:scale-105"
                  title={partner.name}
                >
                  <div className="flex flex-col items-center gap-2">
                    <PartnerLogo name={partner.name} slug={partner.slug} size={64} />
                    <span
                      className="text-[10px] tracking-[0.1em] uppercase font-body opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {partner.name.length > 18 ? partner.name.slice(0, 18) + '...' : partner.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/partners"
                className="text-sm font-body transition-colors hover:text-[var(--teal)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                View All Partners →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
}
