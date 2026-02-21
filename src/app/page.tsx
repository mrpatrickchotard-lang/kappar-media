import Link from 'next/link';
import { getFeaturedArticles, getLatestArticles } from '@/lib/content';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Logo } from '@/components/Logo';

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles();
  const latestArticles = await getLatestArticles(6);

  const heroArticle = featuredArticles[0];
  const otherFeatured = featuredArticles.slice(1, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'var(--bg-primary)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(42,138,122,0.18), transparent 50%, rgba(42,138,122,0.08))' }}></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(42,138,122,0.15)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(42,138,122,0.08)' }}></div>
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
              className="px-8 py-4 font-body rounded-xl transition-colors border"
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
              className="px-8 py-4 bg-transparent font-body rounded-xl transition-colors border"
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
            <Link href="/content" className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
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

      {/* Categories */}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Tech', 'Business', 'Marketing', 'Lifestyle'].map((category) => (
              <Link
                key={category}
                href={`/content?category=${category.toLowerCase()}`}
                className="group p-8 rounded-2xl transition-all text-center"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(42,138,122,0.15)' }}
                >
                  <span className="font-display text-2xl" style={{ color: 'var(--teal)' }}>
                    {category[0]}
                  </span>
                </div>
                <h3 className="font-display text-lg font-light tracking-wide transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
}
