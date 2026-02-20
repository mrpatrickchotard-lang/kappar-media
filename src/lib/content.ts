import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

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

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function getAllArticles(): Promise<Article[]> {
  const articlesDirectory = path.join(contentDirectory, 'articles');
  
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(articlesDirectory).filter(f => f.endsWith('.md'));
  
  const articles = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const processedContent = await remark().use(html).process(content);
      const contentHtml = processedContent.toString();
      
      return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        content: contentHtml,
        date: data.date || new Date().toISOString(),
        author: data.author || 'Kappar Editorial',
        category: data.category || 'Business',
        tags: data.tags || [],
        featured: data.featured || false,
        coverImage: data.coverImage,
        readingTime: calculateReadingTime(content),
      };
    })
  );
  
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(a => a.slug === slug) || null;
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => a.featured).slice(0, 3);
}

export async function getLatestArticles(limit: number = 6): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.slice(0, limit);
}

export function getCategories(): string[] {
  return ['Tech', 'Business', 'Marketing', 'Lifestyle'];
}

export async function getAllTags(): Promise<string[]> {
  const articles = await getAllArticles();
  const allTags = articles.flatMap(a => a.tags);
  return [...new Set(allTags)].sort();
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => a.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export async function getRelatedArticles(currentSlug: string, limit: number = 3): Promise<Article[]> {
  const currentArticle = await getArticleBySlug(currentSlug);
  if (!currentArticle) return [];
  
  const allArticles = await getAllArticles();
  
  // Score articles by shared tags and category
  const scored = allArticles
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
