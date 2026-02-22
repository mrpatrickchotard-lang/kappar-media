// Purpose-built SVG icons for each content category
import type { ReactNode } from 'react';

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ category, size = 28, className = '' }: CategoryIconProps) {
  const cat = category.toLowerCase();

  const icons: Record<string, ReactNode> = {
    tech: (
      // Chip / processor icon
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    business: (
      // Trending chart icon
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
        <line x1="2" y1="21" x2="22" y2="21" opacity="0.4" />
      </svg>
    ),
    marketing: (
      // Megaphone / broadcast icon
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M3 17l2.5 4h2L5 17" />
        <circle cx="18" cy="5" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
        <path d="M20.5 8.5c1 1.5 1 3.5 0 5" opacity="0.5" />
      </svg>
    ),
    lifestyle: (
      // Compass icon
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.2" stroke="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    events: (
      // Calendar with star icon
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M12 14l1.5 1.5L12 17l-1.5-1.5z" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  };

  return icons[cat] || icons.tech;
}
