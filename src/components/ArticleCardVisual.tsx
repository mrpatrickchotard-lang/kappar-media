// Unique generative visuals for article cards, per category
// Each category gets a distinct abstract pattern
import type { ReactNode } from 'react';

interface ArticleCardVisualProps {
  category: string;
  slug: string;
  className?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const categoryPalettes: Record<string, { bg: string; accent1: string; accent2: string; accent3: string }> = {
  tech: {
    bg: 'rgba(42,138,122,0.9)',
    accent1: 'rgba(58,170,154,0.6)',
    accent2: 'rgba(26,106,90,0.7)',
    accent3: 'rgba(74,186,138,0.4)',
  },
  business: {
    bg: 'rgba(26,90,74,0.9)',
    accent1: 'rgba(216,205,184,0.3)',
    accent2: 'rgba(42,138,122,0.5)',
    accent3: 'rgba(168,152,128,0.3)',
  },
  marketing: {
    bg: 'rgba(42,138,122,0.75)',
    accent1: 'rgba(212,160,48,0.25)',
    accent2: 'rgba(58,170,154,0.4)',
    accent3: 'rgba(245,243,239,0.1)',
  },
  lifestyle: {
    bg: 'rgba(74,186,138,0.6)',
    accent1: 'rgba(42,138,122,0.5)',
    accent2: 'rgba(245,243,239,0.15)',
    accent3: 'rgba(26,106,90,0.4)',
  },
};

export function ArticleCardVisual({ category, slug, className = '' }: ArticleCardVisualProps) {
  const cat = category.toLowerCase();
  const palette = categoryPalettes[cat] || categoryPalettes.tech;
  const h = hashCode(slug);

  // Deterministic positions from slug hash
  const x1 = 10 + (h % 40);
  const y1 = 10 + ((h >> 4) % 30);
  const x2 = 50 + ((h >> 8) % 40);
  const y2 = 40 + ((h >> 12) % 40);
  const r1 = 60 + (h % 100);
  const r2 = 40 + ((h >> 6) % 80);
  const r3 = 30 + ((h >> 10) % 60);

  // Category-specific geometric patterns
  const patterns: Record<string, ReactNode> = {
    tech: (
      <>
        {/* Circuit-like grid lines */}
        <line x1={`${x1}%`} y1="0" x2={`${x1}%`} y2="100%" stroke={palette.accent1} strokeWidth="0.5" />
        <line x1="0" y1={`${y1}%`} x2="100%" y2={`${y1}%`} stroke={palette.accent1} strokeWidth="0.5" />
        <line x1={`${x2}%`} y1="0" x2={`${x2}%`} y2="100%" stroke={palette.accent1} strokeWidth="0.5" opacity="0.5" />
        <line x1="0" y1={`${y2}%`} x2="100%" y2={`${y2}%`} stroke={palette.accent1} strokeWidth="0.5" opacity="0.5" />
        {/* Node dots */}
        <circle cx={`${x1}%`} cy={`${y1}%`} r="4" fill={palette.accent3} />
        <circle cx={`${x2}%`} cy={`${y2}%`} r="3" fill={palette.accent3} />
        <circle cx={`${x1}%`} cy={`${y2}%`} r="5" fill={palette.accent1} />
        {/* Diagonal connector */}
        <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={palette.accent3} strokeWidth="0.5" strokeDasharray="4 4" />
        {/* Large decorative circle */}
        <circle cx={`${x2 + 10}%`} cy={`${y1 - 5}%`} r={r1} fill="none" stroke={palette.accent1} strokeWidth="0.5" />
        <circle cx={`${x1 - 5}%`} cy={`${y2 + 10}%`} r={r2} fill="none" stroke={palette.accent2} strokeWidth="0.5" />
      </>
    ),
    business: (
      <>
        {/* Bar chart abstract */}
        <rect x={`${15 + (h % 10)}%`} y={`${40 + (h % 20)}%`} width="8%" height={`${30 + (h % 20)}%`} fill={palette.accent1} rx="2" />
        <rect x={`${30 + (h % 10)}%`} y={`${25 + ((h >> 3) % 20)}%`} width="8%" height={`${45 + ((h >> 3) % 20)}%`} fill={palette.accent2} rx="2" />
        <rect x={`${45 + (h % 10)}%`} y={`${35 + ((h >> 6) % 15)}%`} width="8%" height={`${35 + ((h >> 6) % 15)}%`} fill={palette.accent1} rx="2" />
        <rect x={`${60 + (h % 10)}%`} y={`${20 + ((h >> 9) % 25)}%`} width="8%" height={`${50 + ((h >> 9) % 15)}%`} fill={palette.accent3} rx="2" />
        {/* Trend line */}
        <polyline
          points={`${20 + (h % 10)}%,${55 + (h % 15)}% ${35 + (h % 10)}%,${35 + ((h >> 3) % 20)}% ${50 + (h % 10)}%,${45 + ((h >> 6) % 10)}% ${65 + (h % 10)}%,${25 + ((h >> 9) % 20)}%`}
          fill="none"
          stroke={palette.accent1}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Decorative circles */}
        <circle cx="85%" cy="20%" r={r3} fill="none" stroke={palette.accent2} strokeWidth="0.5" />
      </>
    ),
    marketing: (
      <>
        {/* Concentric rings (target/audience) */}
        <circle cx={`${45 + (h % 15)}%`} cy={`${50 + ((h >> 4) % 10)}%`} r={r1 * 0.8} fill="none" stroke={palette.accent1} strokeWidth="0.5" />
        <circle cx={`${45 + (h % 15)}%`} cy={`${50 + ((h >> 4) % 10)}%`} r={r1 * 0.55} fill="none" stroke={palette.accent2} strokeWidth="0.5" />
        <circle cx={`${45 + (h % 15)}%`} cy={`${50 + ((h >> 4) % 10)}%`} r={r1 * 0.3} fill="none" stroke={palette.accent1} strokeWidth="0.5" />
        <circle cx={`${45 + (h % 15)}%`} cy={`${50 + ((h >> 4) % 10)}%`} r="4" fill={palette.accent1} />
        {/* Radiating lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 45 + (h % 15);
          const cy = 50 + ((h >> 4) % 10);
          const len = r1 * 0.9;
          return (
            <line
              key={angle}
              x1={`${cx}%`}
              y1={`${cy}%`}
              x2={`${cx + Math.cos(rad) * len * 0.4}%`}
              y2={`${cy + Math.sin(rad) * len * 0.3}%`}
              stroke={palette.accent3}
              strokeWidth="0.5"
              opacity="0.5"
            />
          );
        })}
      </>
    ),
    lifestyle: (
      <>
        {/* Organic flowing curves */}
        <path
          d={`M 0,${60 + (h % 20)} Q ${25 + (h % 20)},${30 + ((h >> 4) % 30)} ${50 + ((h >> 2) % 10)},${50 + ((h >> 6) % 20)} T 100,${40 + ((h >> 8) % 30)}`}
          fill="none"
          stroke={palette.accent1}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d={`M 0,${75 + (h % 15)} Q ${30 + ((h >> 2) % 20)},${45 + ((h >> 5) % 25)} ${55 + ((h >> 3) % 10)},${65 + ((h >> 7) % 15)} T 100,${55 + ((h >> 9) % 25)}`}
          fill="none"
          stroke={palette.accent2}
          strokeWidth="1"
          opacity="0.4"
        />
        {/* Decorative dots */}
        <circle cx={`${20 + (h % 20)}%`} cy={`${30 + ((h >> 3) % 30)}%`} r="6" fill={palette.accent1} opacity="0.5" />
        <circle cx={`${60 + ((h >> 5) % 20)}%`} cy={`${25 + ((h >> 7) % 25)}%`} r="4" fill={palette.accent3} opacity="0.4" />
        <circle cx={`${80 + ((h >> 2) % 10)}%`} cy={`${60 + ((h >> 8) % 20)}%`} r="8" fill={palette.accent2} opacity="0.3" />
        <circle cx={`${35 + ((h >> 6) % 15)}%`} cy={`${70 + ((h >> 4) % 15)}%`} r="3" fill={palette.accent1} opacity="0.6" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`w-full h-full ${className}`}
      style={{ background: palette.bg }}
    >
      <defs>
        <linearGradient id={`grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.accent2} stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#grad-${slug})`} />
      {patterns[cat] || patterns.tech}
    </svg>
  );
}
