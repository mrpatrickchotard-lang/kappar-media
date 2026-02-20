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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#08080a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c2e2e]/30 via-transparent to-[#4aba8a]/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0c2e2e]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4aba8a]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-12">
            <Logo variant="teal" size={80} />
          </div>
          
          <p className="text-[#4aba8a] text-sm tracking-[0.4em] uppercase font-body mb-6">
            Forward Media
          </p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-[#e8e4df] mb-8">
            KAPPAR
          </h1>
          
          <p className="text-xl md:text-2xl text-[#888] max-w-2xl mx-auto mb-12 leading-relaxed">
            Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/content"
              className="px-8 py-4 bg-[#0c2e2e] text-[#c8c0a0] font-body rounded-xl hover:bg-[#1a4a4a] transition-colors border border-[#1a4a4a]"
            >
              Explore Content
            </Link>
            <Link
              href="/newsletter"
              className="px-8 py-4 bg-transparent text-[#e8e4df] font-body rounded-xl hover:bg-[#1a1a1e] transition-colors border border-[#2a2a30]"
            >
              Subscribe
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-[#2a2a30] rounded-full flex justify-center">
            <div className="w-1 h-2 bg-[#5a8a80] rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>
      
      {/* Featured Content */}
      <section className="py-24 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <span className="text-[#4aba8a] text-xs tracking-[0.3em] uppercase font-body mb-2 block">
                Featured
              </span>
              <h2 className="font-display text-3xl font-light tracking-wide text-[#e8e4df]">
                Latest Insights
              </h2>
            </div>
            <Link href="/content" className="text-sm text-[#888] hover:text-[#c8c0a0] transition-colors">
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
      <section className="py-24 bg-[#0a0a0a] border-y border-[#1a1a1e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#4aba8a] text-xs tracking-[0.3em] uppercase font-body mb-2 block">
              Coverage
            </span>
            <h2 className="font-display text-3xl font-light tracking-wide text-[#e8e4df]">
              What We Cover
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Tech', 'Business', 'Marketing', 'Lifestyle'].map((category) => (
              <Link
                key={category}
                href={`/content?category=${category.toLowerCase()}`}
                className="group p-8 bg-[#0f0f12] border border-[#1a1a1e] rounded-2xl hover:border-[#2a2a30] transition-all text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0c2e2e]/30 flex items-center justify-center group-hover:bg-[#0c2e2e]/50 transition-colors">
                  <span className="font-display text-2xl text-[#c8c0a0]">
                    {category[0]}
                  </span>
                </div>
                <h3 className="font-display text-lg font-light tracking-wide text-[#e8e4df] group-hover:text-[#c8c0a0] transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Articles */}
      <section className="py-24 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <span className="text-[#4aba8a] text-xs tracking-[0.3em] uppercase font-body mb-2 block">
                Recent
              </span>
              <h2 className="font-display text-3xl font-light tracking-wide text-[#e8e4df]">
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
