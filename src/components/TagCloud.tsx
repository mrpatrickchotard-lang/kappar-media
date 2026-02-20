import Link from 'next/link';
import { getAllTags } from '@/lib/content';

interface TagCloudProps {
  selectedTag?: string;
}

export async function TagCloud({ selectedTag }: TagCloudProps) {
  const tags = await getAllTags();
  
  if (tags.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <p className="text-xs tracking-[0.2em] uppercase text-tertiary mb-4">Tags</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
            className={`tag transition-all ${
              selectedTag?.toLowerCase() === tag.toLowerCase()
                ? 'tag-primary'
                : 'tag-outline hover:border-[var(--accent-emerald)] hover:text-[var(--accent-emerald)]'
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

interface TagListProps {
  tags: string[];
  size?: 'sm' | 'md';
}

export function TagList({ tags, size = 'md' }: TagListProps) {
  if (tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
          className={`tag tag-outline hover:border-[var(--accent-emerald)] hover:text-[var(--accent-emerald)] transition-all ${
            size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
