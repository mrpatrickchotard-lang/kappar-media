import Link from 'next/link';
import { Article } from '@/lib/content';

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
          <div className="aspect-[16/9] bg-gradient-to-br from-[var(--mt-disc)] to-[var(--accent-secondary)] relative overflow-hidden">
            {article.coverImage ? (
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-[var(--accent-primary)]/90 text-[var(--accent-gold)] text-xs font-body tracking-wider uppercase rounded-full">
                {article.category}
              </span>
              {article.featured && (
                <span className="px-3 py-1 bg-[var(--accent-emerald)]/90 text-white text-xs font-body tracking-wider uppercase rounded-full">
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
            
            <h3 className="font-display text-2xl font-light tracking-wide text-primary group-hover:text-[var(--accent-gold)] transition-colors mb-3">
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
        <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-[var(--mt-disc)]/50 to-[var(--accent-secondary)]/30 mb-5 relative overflow-hidden group-hover:shadow-md transition-all" style={{ border: '1px solid var(--border-primary)' }}>
          {article.coverImage ? (
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          )}
          
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-[var(--bg-primary)]/80 text-[var(--accent-gold)] text-[10px] font-body tracking-wider uppercase rounded-full">
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
        
        <h3 className="font-display text-lg font-light tracking-wide text-primary group-hover:text-[var(--accent-gold)] transition-colors mb-2">
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
