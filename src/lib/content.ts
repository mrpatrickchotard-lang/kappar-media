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
  {
    slug: 'personal-branding-for-executives',
    title: 'Personal Branding for Executives: Standing Out in 2026',
    excerpt: 'How C-suite leaders can build authentic personal brands that drive business growth and attract top talent.',
    content: '<h2>The Executive Brand Imperative</h2><p>In an era where talent and capital flow to people they trust, executive personal branding is no longer optional. The most successful business leaders understand that their personal reputation is inseparable from their company\'s brand.</p><h3>Building Your Platform</h3><p>Start with thought leadership content that showcases your unique perspective. LinkedIn remains the primary platform for executive visibility, but podcasts and speaking engagements amplify your reach. The key is consistency and authenticity.</p><h3>Measuring Impact</h3><p>Track engagement metrics, inbound opportunities, and brand sentiment. The best executive brands generate tangible business outcomes: recruitment advantages, partnership opportunities, and media coverage.</p>',
    date: '2026-01-22T08:00:00Z',
    author: 'Aisha Patel',
    category: 'Marketing',
    tags: ['Personal Branding', 'Executive Leadership', 'Marketing Strategy', 'LinkedIn'],
    featured: false,
    readingTime: 5,
  },
  {
    slug: 'content-marketing-mena-market',
    title: 'Content Marketing Strategies for the MENA Market',
    excerpt: 'Navigating cultural nuances and digital habits to create compelling content for Middle Eastern audiences.',
    content: '<h2>Understanding the MENA Audience</h2><p>The Middle East and North Africa presents unique opportunities and challenges for content marketers. With a young, digitally connected population and high social media penetration, the region is ripe for innovative content strategies.</p><h3>Cultural Sensitivity</h3><p>Successful content marketing in MENA requires deep understanding of cultural values, religious observances, and local business customs. Arabic-first content strategies outperform translated content by a significant margin.</p><h3>Platform Preferences</h3><p>While Instagram and TikTok dominate consumer engagement, LinkedIn and Twitter/X are essential for B2B content. WhatsApp and Telegram are increasingly important distribution channels.</p>',
    date: '2026-01-18T12:00:00Z',
    author: 'Sarah Chen',
    category: 'Marketing',
    tags: ['Content Marketing', 'MENA', 'Digital Strategy', 'Social Media'],
    featured: false,
    readingTime: 6,
  },
  {
    slug: 'remote-work-dubai-hub',
    title: 'Dubai as a Global Remote Work Hub: The New Reality',
    excerpt: 'Why Dubai is attracting digital nomads and remote workers from around the world, and what it means for business.',
    content: '<h2>The Dubai Digital Nomad Boom</h2><p>Dubai\'s strategic time zone, world-class infrastructure, and progressive visa policies have made it one of the top destinations for remote workers and digital nomads. The city\'s virtual working program and golden visa initiatives are reshaping its workforce.</p><h3>Infrastructure Advantages</h3><p>From co-working spaces in DIFC to beachside cafes with reliable Wi-Fi, Dubai offers a unique blend of productivity and lifestyle. The city\'s tax-free environment and growing startup ecosystem make it attractive for entrepreneurs.</p><h3>Community and Networking</h3><p>Dubai\'s diverse expat community creates natural networking opportunities. Regular meetups, conferences, and social events make it easy to build professional relationships across industries and cultures.</p>',
    date: '2026-01-12T15:00:00Z',
    author: 'James O\'Connor',
    category: 'Lifestyle',
    tags: ['Remote Work', 'Dubai', 'Digital Nomads', 'Lifestyle'],
    featured: false,
    readingTime: 5,
  },
  {
    slug: 'wellness-productivity-business-leaders',
    title: 'The Wellness-Productivity Connection for Business Leaders',
    excerpt: 'How top executives are integrating wellness practices into their routines to maintain peak performance.',
    content: '<h2>Performance Through Wellness</h2><p>The most effective business leaders have discovered that sustainable high performance requires intentional wellness practices. From sleep optimization to structured exercise, the connection between physical health and business outcomes is well-documented.</p><h3>Morning Routines</h3><p>Successful executives increasingly prioritize morning routines that include meditation, exercise, and focused planning. These rituals create mental clarity and resilience that compound throughout the day.</p><h3>The Recovery Imperative</h3><p>Just as athletes plan recovery periods, business leaders must schedule downtime. The best performers understand that rest is not a luxury but a strategic investment in long-term productivity and decision-making quality.</p>',
    date: '2026-01-08T10:00:00Z',
    author: 'Elena Petrova',
    category: 'Lifestyle',
    tags: ['Wellness', 'Productivity', 'Leadership', 'Executive Health'],
    featured: false,
    readingTime: 4,
  },
  {
    slug: 'dubai-luxury-real-estate-2026',
    title: 'Dubai Luxury Real Estate: What\'s Driving the 2026 Boom',
    excerpt: 'Record-breaking transactions, global capital flows, and new mega-projects are reshaping Dubai\'s premium property market.',
    content: '<h2>A Market in Overdrive</h2><p>Dubai\'s luxury real estate market continues to defy global headwinds, with 2026 shaping up to be another record year. Ultra-high-net-worth individuals from Europe, Asia, and the Americas are diversifying into Dubai property at unprecedented rates, drawn by tax advantages, golden visa pathways, and world-class lifestyle offerings.</p><h3>Key Drivers</h3><p>Several factors are fueling the boom: the expansion of branded residences (Bulgari, Armani, Dorchester Collection), the launch of new waterfront mega-projects, and increasing demand from tech entrepreneurs relocating to the emirate. Palm Jebel Ali\'s revival has added fresh momentum to the ultra-prime segment.</p><h3>Investment Outlook</h3><p>Average yields in prime Dubai remain attractive at 5-7%, significantly outperforming London and New York. However, investors should be mindful of rising construction costs and the importance of selecting developments with proven operators and strong rental demand fundamentals.</p>',
    date: '2026-02-18T09:00:00Z',
    author: 'James O\'Connor',
    category: 'Real Estate',
    tags: ['Dubai', 'Luxury Property', 'Investment', 'Real Estate'],
    featured: true,
    readingTime: 6,
  },
  {
    slug: 'proptech-transforming-mena-real-estate',
    title: 'How PropTech Is Transforming MENA Real Estate',
    excerpt: 'From AI-powered valuations to blockchain title deeds, technology is revolutionizing property transactions across the Middle East.',
    content: '<h2>The PropTech Revolution</h2><p>The MENA region is witnessing a surge in property technology adoption. Governments and private developers alike are embracing digital solutions to streamline transactions, improve transparency, and enhance the buyer experience.</p><h3>Digital Title Deeds</h3><p>Dubai Land Department\'s blockchain-based title deed system has set a global benchmark. The platform enables instant property transfers, reduces fraud, and makes cross-border transactions seamless. Other GCC nations are following suit with their own digital property registries.</p><h3>AI in Valuation</h3><p>Machine learning models are now capable of pricing properties with remarkable accuracy by analyzing thousands of comparable transactions, market trends, and location-specific factors. This technology is democratizing access to institutional-grade market intelligence for individual investors.</p>',
    date: '2026-02-02T11:00:00Z',
    author: 'Mohammed Al-Rashid',
    category: 'Real Estate',
    tags: ['PropTech', 'Blockchain', 'AI', 'MENA', 'Real Estate'],
    featured: false,
    readingTime: 5,
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
  return ['Tech', 'Business', 'Marketing', 'Lifestyle', 'Real Estate'];
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
