import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticles } from '@/lib/content';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }
  
  return (
    <article className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/content"
          className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#c8c0a0] transition-colors mb-12"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Content
        </Link>
        
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-[#0c2e2e] text-[#c8c0a0] text-xs font-body tracking-wider uppercase rounded-full mb-6">
          {article.category}
        </span>
        
        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-[#e8e4df] mb-6">
          {article.title}
        </h1>
        
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-[#666] mb-12 pb-12 border-b border-[#1a1a1e]">
          <span>{article.author}</span>
          <span className="w-1 h-1 rounded-full bg-[#555]"></span>
          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        
        {/* Content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Share */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1e]">
          <p className="text-sm text-[#666] mb-4">Share this article</p>
          <div className="flex gap-3">
            <button className="p-3 bg-[#0f0f12] border border-[#1a1a1e] rounded-lg hover:border-[#2a2a30] transition-colors">
              <svg className="w-5 h-5 text-[#888]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button className="p-3 bg-[#0f0f12] border border-[#1a1a1e] rounded-lg hover:border-[#2a2a30] transition-colors">
              <svg className="w-5 h-5 text-[#888]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
