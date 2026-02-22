import Link from 'next/link';
import { Article } from '@/lib/content';
import { ArticleCardVisual } from './ArticleCardVisual';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  showTags?: boolean;
}

export function ArticleCard({ article, featured = false, showTags = true }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/content/${article.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl card-hover" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="aspect-[16/9] relative overflow-hidden">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                <ArticleCardVisual category={article.category} slug={article.slug} />
              </div>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-[var(--accent-primary)]/90 text-[var(--accent-gold)] text-xs font-body tracking-wider uppercase rounded-full backdrop-blur-sm">
                {article.category}
              </span>
              {article.featured && (
                <span className="px-3 py-1 bg-[var(--accent-emerald)]/90 text-white text-xs font-body tracking-wider uppercase rounded-full backdrop-blur-sm">
                  Featured
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            {showTags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag tag-outline text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="font-display text-2xl font-light tracking-wide text-primary group-hover:text-[var(--teal)] transition-colors mb-3">
              {article.title}
            </h3>

            <p className="text-secondary text-base leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-tertiary">
              <span>{article.author}</span>
              <span className="w-1 h-1 rounded-full bg-tertiary"></span>
              <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              {article.readingTime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                  <span>{article.readingTime} min read</span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/content/${article.slug}`} className="group block">
      <article className="flex flex-col h-full">
        <div className="aspect-[16/10] rounded-xl mb-5 relative overflow-hidden card-hover-light" style={{ border: '1px solid var(--border-primary)' }}>
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
              <ArticleCardVisual category={article.category} slug={article.slug} />
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-body tracking-wider uppercase rounded-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#f5f3ef' }}>
              {article.category}
            </span>
          </div>
        </div>

        {showTags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag tag-outline text-[9px] px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-lg font-light tracking-wide text-primary group-hover:text-[var(--teal)] transition-colors mb-2">
          {article.title}
        </h3>

        <p className="text-tertiary text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-tertiary">
          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          {article.readingTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-tertiary"></span>
              <span>{article.readingTime} min</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
