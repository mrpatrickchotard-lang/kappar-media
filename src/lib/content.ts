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
  featured?: boolean;
  coverImage?: string;
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
        featured: data.featured || false,
        coverImage: data.coverImage,
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
