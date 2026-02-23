import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getCategories } from '@/lib/content';
import { ArticleCard } from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'Content',
  description: 'Explore insights, analysis, and expert perspectives on finance, technology, real estate, and business in the MENA region.',
  openGraph: {
    title: 'Content | Kappar Media',
    description: 'Expert insights and analysis on finance, technology, real estate, and business in the MENA region.',
    url: 'https://kappar.tv/content',
  },
  alternates: {
    canonical: 'https://kappar.tv/content',
  },
};

interface ContentPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const { category } = await searchParams;
  const allArticles = await getAllArticles();
  const categories = getCategories();

  const selectedCategory = category;

  const filteredArticles = selectedCategory
    ? allArticles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase())
    : allArticles;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs tracking-[0.3em] uppercase font-body mb-2 block" style={{ color: 'var(--teal)' }}>
            All Stories
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Content
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          <Link
            href="/content"
            className="px-4 py-2 rounded-full text-sm font-body transition-colors"
            style={
              !selectedCategory
                ? { backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }
                : { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }
            }
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/content?category=${category.toLowerCase()}`}
              className="px-4 py-2 rounded-full text-sm font-body transition-colors"
              style={
                selectedCategory?.toLowerCase() === category.toLowerCase()
                  ? { backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }
                  : { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }
              }
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}

        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>No articles in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
