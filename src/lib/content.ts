// In-memory content store for Vercel compatibility
// Replaces file-based markdown reading with static data

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  readingTime?: number;
}

// Sample articles data
const articles: Article[] = [
  {
    slug: 'future-of-fintech-in-mena',
    title: 'The Future of Fintech in MENA: Trends Shaping 2026',
    excerpt: 'Explore the key fintech trends transforming the Middle East and North Africa region, from open banking to digital assets.',
    content: '<h2>The MENA Fintech Revolution</h2><p>The Middle East and North Africa region is experiencing an unprecedented wave of financial technology innovation. With governments actively supporting digital transformation and a young, tech-savvy population, the region is poised to become a global fintech hub.</p><h3>Key Trends</h3><p>Open banking regulations are being adopted across the GCC, enabling new financial services and fostering competition. Digital payment adoption has accelerated, with mobile wallets becoming the preferred payment method for a growing segment of consumers.</p><h3>Looking Ahead</h3><p>As we move through 2026, expect to see increased collaboration between traditional banks and fintech startups, more regulatory sandboxes, and the emergence of new digital asset frameworks across the region.</p>',
    date: '2026-02-15T10:00:00Z',
    author: 'Sarah Chen',
    category: 'Tech',
    tags: ['Fintech', 'MENA', 'Digital Banking', 'Innovation'],
    featured: true,
    readingTime: 5,
  },
  {
    slug: 'expert-consultations-digital-age',
    title: 'Why Expert Consultations Matter in the Digital Age',
    excerpt: 'In a world flooded with information, connecting with verified industry experts provides unmatched value for decision-makers.',
    content: '<h2>The Value of Expert Knowledge</h2><p>In today\'s fast-paced business environment, having access to the right expertise at the right time can make the difference between success and failure. Expert consultations provide targeted, personalized insights that no amount of online research can replace.</p><h3>The Kappar Advantage</h3><p>Our platform connects you with verified industry leaders who bring years of hands-on experience. Whether you\'re navigating regulatory challenges, exploring new markets, or making critical technology decisions, our experts provide the clarity you need.</p>',
    date: '2026-02-10T14:00:00Z',
    author: 'Kappar Editorial',
    category: 'Business',
    tags: ['Consulting', 'Expert Networks', 'Business Strategy'],
    featured: true,
    readingTime: 4,
  },
  {
    slug: 'islamic-finance-digital-transformation',
    title: 'Islamic Finance Meets Digital Transformation',
    excerpt: 'How Sharia-compliant fintech solutions are bridging tradition and innovation in financial services.',
    content: '<h2>Bridging Tradition and Innovation</h2><p>Islamic finance, with its emphasis on ethical investing and risk-sharing, is finding new expression through digital platforms. Fintech companies are developing Sharia-compliant solutions that make Islamic financial services more accessible than ever.</p><h3>Digital Sukuk and Beyond</h3><p>From digital sukuk issuance to AI-powered Sharia compliance screening, technology is enabling new product categories that were previously impossible. These innovations are attracting both Muslim and non-Muslim investors seeking ethical financial alternatives.</p>',
    date: '2026-02-05T09:00:00Z',
    author: 'Mohammed Al-Rashid',
    category: 'Tech',
    tags: ['Islamic Finance', 'Fintech', 'Digital Transformation', 'Sharia Compliance'],
    featured: false,
    readingTime: 6,
  },
  {
    slug: 'building-wealth-tech-startup',
    title: 'Building a WealthTech Startup: Lessons from the Field',
    excerpt: 'Practical insights from founders who have successfully built and scaled wealth management technology companies.',
    content: '<h2>Lessons from WealthTech Founders</h2><p>Building a wealth management technology company requires navigating complex regulatory environments, building trust with high-net-worth individuals, and delivering exceptional user experiences. Here are key lessons from founders who have done it successfully.</p><h3>Start with Trust</h3><p>In wealth management, trust is everything. Your technology must be secure, your team must be credible, and your value proposition must be clear from day one.</p>',
    date: '2026-01-28T11:00:00Z',
    author: 'Elena Petrova',
    category: 'Business',
    tags: ['WealthTech', 'Startups', 'Entrepreneurship', 'Investment'],
    featured: true,
    readingTime: 7,
  },
];

export async function getAllArticles(): Promise<Article[]> {
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articles.find(a => a.slug === slug) || null;
}

export async function getFeaturedArticles(): Promise<Article[]> {
  return articles.filter(a => a.featured).slice(0, 3);
}

export async function getLatestArticles(limit: number = 6): Promise<Article[]> {
  const sorted = await getAllArticles();
  return sorted.slice(0, limit);
}

export function getCategories(): string[] {
  return ['Tech', 'Business', 'Marketing', 'Lifestyle'];
}

export async function getAllTags(): Promise<string[]> {
  const allTags = articles.flatMap(a => a.tags);
  return [...new Set(allTags)].sort();
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  return articles.filter(a => a.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export async function getRelatedArticles(currentSlug: string, limit: number = 3): Promise<Article[]> {
  const currentArticle = await getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const allArticlesData = await getAllArticles();

  const scored = allArticlesData
    .filter(a => a.slug !== currentSlug)
    .map(a => {
      let score = 0;
      if (a.category === currentArticle.category) score += 2;
      const sharedTags = a.tags.filter(t => currentArticle.tags.includes(t));
      score += sharedTags.length;
      return { article: a, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.article);
}

