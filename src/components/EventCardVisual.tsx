// Generative SVG visuals for event cards, per event type
// Each type gets a distinct abstract pattern
import type { ReactNode } from 'react';

interface EventCardVisualProps {
  type: string;
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

const typePalettes: Record<string, { bg: string; accent1: string; accent2: string; accent3: string }> = {
  conference: {
    bg: 'rgba(42,138,122,0.85)',
    accent1: 'rgba(212,160,48,0.3)',
    accent2: 'rgba(58,170,154,0.5)',
    accent3: 'rgba(245,243,239,0.15)',
  },
  workshop: {
    bg: 'rgba(26,90,74,0.9)',
    accent1: 'rgba(74,186,138,0.5)',
    accent2: 'rgba(42,138,122,0.6)',
    accent3: 'rgba(216,205,184,0.2)',
  },
  webinar: {
    bg: 'rgba(58,170,154,0.75)',
    accent1: 'rgba(26,106,90,0.5)',
    accent2: 'rgba(245,243,239,0.12)',
    accent3: 'rgba(42,138,122,0.4)',
  },
  networking: {
    bg: 'rgba(42,138,122,0.7)',
    accent1: 'rgba(74,186,138,0.4)',
    accent2: 'rgba(212,160,48,0.2)',
    accent3: 'rgba(58,170,154,0.5)',
  },
  panel: {
    bg: 'rgba(26,106,90,0.85)',
    accent1: 'rgba(42,138,122,0.5)',
    accent2: 'rgba(245,243,239,0.1)',
    accent3: 'rgba(74,186,138,0.35)',
  },
};

export function EventCardVisual({ type, slug, className = '' }: EventCardVisualProps) {
  const t = type.toLowerCase();
  const palette = typePalettes[t] || typePalettes.conference;
  const h = hashCode(slug);

  const x1 = 10 + (h % 40);
  const y1 = 15 + ((h >> 4) % 35);
  const x2 = 55 + ((h >> 8) % 35);
  const y2 = 50 + ((h >> 12) % 30);
  const r1 = 8 + (h % 12);

  const patterns: Record<string, ReactNode> = {
    conference: (
      <>
        {/* Podium / stage lines */}
        <rect x="10" y="70" width="80" height="2" rx="1" fill={palette.accent1} />
        <rect x="20" y="65" width="60" height="2" rx="1" fill={palette.accent2} />
        {/* Abstract audience dots */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <circle
            key={i}
            cx={15 + i * 12 + (h >> (i + 1)) % 5}
            cy={82 + (h >> (i + 2)) % 8}
            r={2 + (h >> (i + 3)) % 2}
            fill={palette.accent3}
          />
        ))}
        {/* Spotlight beams */}
        <line x1={x1} y1="5" x2={x1 + 15} y2="60" stroke={palette.accent2} strokeWidth="0.5" opacity="0.6" />
        <line x1={x2} y1="5" x2={x2 - 10} y2="60" stroke={palette.accent2} strokeWidth="0.5" opacity="0.6" />
        {/* Decorative shapes */}
        <circle cx={x1} cy={y1} r={r1} fill={palette.accent1} opacity="0.5" />
        <circle cx={x2} cy={y2 - 10} r={r1 * 0.7} fill={palette.accent3} opacity="0.6" />
      </>
    ),
    workshop: (
      <>
        {/* Grid / workspace lines */}
        <line x1="10" y1="20" x2="90" y2="20" stroke={palette.accent1} strokeWidth="0.5" strokeDasharray="4 3" />
        <line x1="10" y1="50" x2="90" y2="50" stroke={palette.accent1} strokeWidth="0.5" strokeDasharray="4 3" />
        <line x1="10" y1="80" x2="90" y2="80" stroke={palette.accent1} strokeWidth="0.5" strokeDasharray="4 3" />
        {/* Tool / pencil shapes */}
        <rect x={x1} y={y1} width="18" height="3" rx="1.5" fill={palette.accent2} transform={`rotate(${15 + h % 30}, ${x1 + 9}, ${y1 + 1.5})`} />
        <rect x={x2} y={y2} width="14" height="3" rx="1.5" fill={palette.accent3} transform={`rotate(${-10 + h % 25}, ${x2 + 7}, ${y2 + 1.5})`} />
        {/* Sticky notes */}
        <rect x={x1 - 5} y={y2 - 5} width="12" height="12" rx="1" fill={palette.accent1} opacity="0.6" />
        <rect x={x2 - 3} y={y1 + 5} width="10" height="10" rx="1" fill={palette.accent2} opacity="0.5" />
        {/* Dots */}
        <circle cx={50} cy={50} r={r1} fill={palette.accent3} opacity="0.3" />
      </>
    ),
    webinar: (
      <>
        {/* Screen / monitor shape */}
        <rect x="15" y="15" width="70" height="45" rx="3" fill="none" stroke={palette.accent1} strokeWidth="1" />
        <line x1="50" y1="60" x2="50" y2="70" stroke={palette.accent1} strokeWidth="1" />
        <line x1="35" y1="70" x2="65" y2="70" stroke={palette.accent1} strokeWidth="1" />
        {/* Play button */}
        <polygon points={`${45},${30} ${45},${48} ${60},${39}`} fill={palette.accent2} opacity="0.6" />
        {/* Signal waves */}
        <circle cx={x2} cy={y1} r="6" fill="none" stroke={palette.accent3} strokeWidth="0.5" />
        <circle cx={x2} cy={y1} r="12" fill="none" stroke={palette.accent3} strokeWidth="0.5" opacity="0.5" />
        <circle cx={x2} cy={y1} r="18" fill="none" stroke={palette.accent3} strokeWidth="0.5" opacity="0.3" />
      </>
    ),
    networking: (
      <>
        {/* Connection nodes */}
        {[
          { x: 25, y: 25 }, { x: 75, y: 20 }, { x: 50, y: 50 },
          { x: 20, y: 75 }, { x: 80, y: 70 }, { x: 50, y: 85 },
        ].map((node, i) => (
          <circle
            key={`node-${i}`}
            cx={node.x + (h >> (i + 1)) % 8 - 4}
            cy={node.y + (h >> (i + 2)) % 8 - 4}
            r={3 + (h >> (i + 3)) % 3}
            fill={i % 2 === 0 ? palette.accent1 : palette.accent2}
            opacity="0.7"
          />
        ))}
        {/* Connection lines */}
        <line x1="25" y1="25" x2="50" y2="50" stroke={palette.accent3} strokeWidth="0.5" opacity="0.5" />
        <line x1="75" y1="20" x2="50" y2="50" stroke={palette.accent3} strokeWidth="0.5" opacity="0.5" />
        <line x1="50" y1="50" x2="20" y2="75" stroke={palette.accent3} strokeWidth="0.5" opacity="0.5" />
        <line x1="50" y1="50" x2="80" y2="70" stroke={palette.accent3} strokeWidth="0.5" opacity="0.5" />
        <line x1="20" y1="75" x2="50" y2="85" stroke={palette.accent3} strokeWidth="0.5" opacity="0.4" />
        <line x1="80" y1="70" x2="50" y2="85" stroke={palette.accent3} strokeWidth="0.5" opacity="0.4" />
        {/* Decorative ring */}
        <circle cx="50" cy="50" r={r1 + 10} fill="none" stroke={palette.accent2} strokeWidth="0.5" opacity="0.3" />
      </>
    ),
    panel: (
      <>
        {/* Panel seats / chairs */}
        {[20, 38, 56, 74].map((cx, i) => (
          <g key={i}>
            <rect x={cx - 5} y="55" width="10" height="3" rx="1.5" fill={palette.accent1} opacity="0.7" />
            <circle cx={cx} cy={48} r="4" fill={palette.accent2} opacity={0.5 + (i % 2) * 0.2} />
          </g>
        ))}
        {/* Discussion lines */}
        <path d={`M 20 35 Q 50 ${20 + h % 15} 80 35`} fill="none" stroke={palette.accent3} strokeWidth="0.5" opacity="0.5" />
        <path d={`M 25 30 Q 50 ${15 + h % 12} 75 30`} fill="none" stroke={palette.accent3} strokeWidth="0.5" opacity="0.3" />
        {/* Microphone icon */}
        <rect x="47" y="70" width="6" height="12" rx="3" fill={palette.accent1} opacity="0.6" />
        <line x1="50" y1="82" x2="50" y2="88" stroke={palette.accent1} strokeWidth="1" opacity="0.5" />
        <line x1="44" y1="88" x2="56" y2="88" stroke={palette.accent1} strokeWidth="1" opacity="0.5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full ${className}`}
    >
      <rect width="100" height="100" fill={palette.bg} />
      {patterns[t] || patterns.conference}
    </svg>
  );
}
