import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '@/lib/content';
import { TagList } from '@/components/TagCloud';
import CopyLinkButton from '@/components/CopyLinkButton';
import { ReadingProgress } from '@/components/ReadingProgress';
import { sanitizeHtml } from '@/lib/sanitize';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
      url: `https://kappar.tv/content/${article.slug}`,
      ...(article.coverImage && { images: [{ url: article.coverImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      ...(article.coverImage && { images: [article.coverImage] }),
    },
    alternates: {
      canonical: `https://kappar.tv/content/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(slug, 3);

  return (
    <article className="min-h-screen pt-32 pb-24">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
          { name: 'Home', url: 'https://kappar.tv' },
          { name: 'Content', url: 'https://kappar.tv/content' },
          { name: article.title, url: `https://kappar.tv/content/${article.slug}` },
        ])) }}
      />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/content"
          className="inline-flex items-center gap-2 text-sm text-tertiary hover:text-[var(--accent-gold)] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Content
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 accent-primary text-[var(--accent-gold)] text-xs font-body tracking-wider uppercase rounded-full">
            {article.category}
          </span>
          {article.featured && (
            <span className="px-3 py-1 bg-[var(--accent-emerald)] text-white text-xs font-body tracking-wider uppercase rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-primary mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-secondary leading-relaxed mb-8 max-w-3xl">
          {article.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-tertiary mb-8 pb-8 border-b border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full accent-primary flex items-center justify-center">
              <span className="text-[var(--accent-gold)] font-display text-sm">{article.author.charAt(0)}</span>
            </div>
            <div>
              <p className="text-primary font-medium">{article.author}</p>
              <p className="text-tertiary">{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          {article.readingTime && (
            <>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-tertiary"></span>
              <span>{article.readingTime} min read</span>
            </>
          )}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-12">
            <TagList tags={article.tags} />
          </div>
        )}

        {/* Content */}
        <div
          className="article-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-primary">
          <p className="text-sm text-tertiary mb-4">Share this article</p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://kappar.tv/content/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-card border border-primary rounded-lg hover:border-secondary transition-colors"
              aria-label="Share on X (Twitter)"
            >
              <svg className="w-5 h-5 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://kappar.tv/content/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-card border border-primary rounded-lg hover:border-secondary transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <CopyLinkButton slug={article.slug} />
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-primary">
            <h3 className="font-display text-xl font-light tracking-wide text-primary mb-8">
              Related Reading
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/content/${related.slug}`} className="group">
                  <article className="bg-card border border-primary rounded-xl p-6 hover:border-secondary transition-all">
                    <span className="text-xs text-[var(--accent-gold)] uppercase tracking-wider">{related.category}</span>
                    <h4 className="font-display text-lg font-light text-primary group-hover:text-[var(--accent-gold)] transition-colors mt-2 mb-3">
                      {related.title}
                    </h4>
                    <p className="text-sm text-tertiary line-clamp-2">{related.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
