import Link from 'next/link';
import { Article } from '@/lib/content';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/content/${article.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-[#0f0f12] border border-[#1a1a1e] hover:border-[#2a2a30] transition-all">
          <div className="aspect-[16/9] bg-gradient-to-br from-[#0c2e2e] to-[#1a4a4a] relative overflow-hidden">
            {article.coverImage ? (
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#c8c0a0]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#c8c0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#0c2e2e]/90 text-[#c8c0a0] text-xs font-body tracking-wider uppercase rounded-full">
                {article.category}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="font-display text-2xl font-light tracking-wide text-[#e8e4df] group-hover:text-[#c8c0a0] transition-colors mb-3">
              {article.title}
            </h3>
            <p className="text-[#888] text-base leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-[#555]">
              <span>{article.author}</span>
              <span className="w-1 h-1 rounded-full bg-[#555]"></span>
              <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }
  
  return (
    <Link href={`/content/${article.slug}`} className="group block">
      <article className="flex flex-col h-full">
        <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-[#0c2e2e]/50 to-[#1a4a4a]/30 mb-5 relative overflow-hidden border border-[#1a1a1e] group-hover:border-[#2a2a30] transition-all">
          {article.coverImage ? (
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#c8c0a0]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#c8c0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          )}
          
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-[#08080a]/80 text-[#c8c0a0] text-[10px] font-body tracking-wider uppercase rounded-full">
              {article.category}
            </span>
          </div>
        </div>
        
        <h3 className="font-display text-lg font-light tracking-wide text-[#e8e4df] group-hover:text-[#c8c0a0] transition-colors mb-2">
          {article.title}
        </h3>
        
        <p className="text-[#666] text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
          {article.excerpt}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-[#555]">
          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </article>
    </Link>
  );
}
