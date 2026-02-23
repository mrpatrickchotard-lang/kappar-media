import type { Metadata } from 'next';
import { getArticlesByTag, getAllTags } from '@/lib/content';
import { ArticleCard } from '@/components/ArticleCard';
import { TagCloud } from '@/components/TagCloud';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag.toLowerCase()),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const displayTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1);
  return {
    title: `${displayTag} Articles`,
    description: `Read the latest articles about ${displayTag} on Kappar Media. Expert insights, analysis, and perspectives.`,
    alternates: {
      canonical: `https://kappar.tv/tags/${tag}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const articles = await getArticlesByTag(decodedTag);
  
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <TagCloud selectedTag={decodedTag} />
            </div>
          </aside>          
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-12">
              <span className="text-[var(--accent-emerald)] text-xs tracking-[0.3em] uppercase font-body mb-2 block">
                Tag
              </span>              
              <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-primary capitalize">
                #{decodedTag}
              </h1>              
              <p className="text-secondary mt-4">
                {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with "{decodedTag}"
              </p>
            </div>            
            
            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card border border-primary rounded-2xl">
                <p className="text-tertiary text-lg">No articles found with this tag.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
