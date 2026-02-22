import type { ReactNode } from 'react';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface PartnerLogoProps {
  name: string;
  slug: string;
  size?: number;
  className?: string;
}

// Generate a unique abstract logo for each partner
export function PartnerLogo({ name, slug, size = 80, className = '' }: PartnerLogoProps) {
  const h = hashCode(slug);

  // Color palette — professional corporate variations
  const palettes = [
    { primary: '#2a8a7a', secondary: '#1a6a5a', accent: '#3aaa9a', bg: '#f0faf7' },
    { primary: '#1a6a5a', secondary: '#2a8a7a', accent: '#d4a830', bg: '#f5f7f0' },
    { primary: '#3aaa9a', secondary: '#2a8a7a', accent: '#1a6a5a', bg: '#f0f5fa' },
    { primary: '#2a7a8a', secondary: '#1a5a6a', accent: '#3a9aaa', bg: '#f0f8fa' },
    { primary: '#4a8a6a', secondary: '#2a6a4a', accent: '#6aaa8a', bg: '#f2faf5' },
    { primary: '#2a6a8a', secondary: '#1a4a6a', accent: '#4a9aba', bg: '#f0f5fa' },
    { primary: '#5a8a7a', secondary: '#3a6a5a', accent: '#7aaa9a', bg: '#f5faf8' },
  ];

  const palette = palettes[h % palettes.length];
  const shape = h % 7; // 7 different logo shapes
  const rotation = (h % 6) * 15; // 0, 15, 30, 45, 60, 75

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Different abstract logo patterns
  const logoShapes: Record<number, ReactNode> = {
    0: ( // Overlapping circles
      <>
        <circle cx="26" cy="32" r="14" fill={palette.primary} opacity="0.8" />
        <circle cx="38" cy="32" r="14" fill={palette.secondary} opacity="0.6" />
        <circle cx="32" cy="24" r="10" fill={palette.accent} opacity="0.5" />
      </>
    ),
    1: ( // Abstract hexagon
      <>
        <polygon
          points="32,10 50,20 50,40 32,50 14,40 14,20"
          fill="none"
          stroke={palette.primary}
          strokeWidth="2.5"
        />
        <polygon
          points="32,16 44,23 44,37 32,44 20,37 20,23"
          fill={palette.primary}
          opacity="0.15"
        />
        <circle cx="32" cy="30" r="6" fill={palette.accent} />
      </>
    ),
    2: ( // Stacked bars
      <>
        <rect x="14" y="16" width="36" height="6" rx="3" fill={palette.primary} />
        <rect x="18" y="26" width="28" height="6" rx="3" fill={palette.secondary} opacity="0.7" />
        <rect x="22" y="36" width="20" height="6" rx="3" fill={palette.accent} opacity="0.5" />
      </>
    ),
    3: ( // Arrow / chevron mark
      <>
        <path
          d="M 18 16 L 38 32 L 18 48"
          fill="none"
          stroke={palette.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 28 20 L 44 32 L 28 44"
          fill="none"
          stroke={palette.accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </>
    ),
    4: ( // Grid / window pattern
      <>
        <rect x="14" y="14" width="14" height="14" rx="3" fill={palette.primary} />
        <rect x="32" y="14" width="14" height="14" rx="3" fill={palette.secondary} opacity="0.6" />
        <rect x="14" y="32" width="14" height="14" rx="3" fill={palette.accent} opacity="0.5" />
        <rect x="32" y="32" width="14" height="14" rx="3" fill={palette.primary} opacity="0.3" />
      </>
    ),
    5: ( // Abstract wave
      <>
        <path
          d="M 10 36 Q 22 18 32 32 Q 42 46 54 28"
          fill="none"
          stroke={palette.primary}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 10 28 Q 22 10 32 24 Q 42 38 54 20"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <circle cx="32" cy="32" r="4" fill={palette.secondary} />
      </>
    ),
    6: ( // Diamond / rhombus
      <>
        <rect
          x="20" y="20" width="24" height="24" rx="2"
          fill={palette.primary}
          opacity="0.15"
          transform={`rotate(45, 32, 32)`}
        />
        <rect
          x="24" y="24" width="16" height="16" rx="2"
          fill={palette.primary}
          transform={`rotate(45, 32, 32)`}
        />
        <circle cx="32" cy="32" r="3" fill={palette.bg} />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`${name} logo`}
    >
      {/* Background */}
      <rect width="64" height="64" rx="14" fill={palette.bg} />

      {/* Logo shape */}
      <g transform={`rotate(${rotation}, 32, 32)`}>
        {logoShapes[shape]}
      </g>
    </svg>
  );
}

// Larger variant for profile pages with company initials overlay
export function PartnerLogoLarge({ name, slug, size = 120, className = '' }: PartnerLogoProps) {
  const h = hashCode(slug);

  const palettes = [
    { primary: '#2a8a7a', secondary: '#1a6a5a', accent: '#3aaa9a', bg: '#f0faf7' },
    { primary: '#1a6a5a', secondary: '#2a8a7a', accent: '#d4a830', bg: '#f5f7f0' },
    { primary: '#3aaa9a', secondary: '#2a8a7a', accent: '#1a6a5a', bg: '#f0f5fa' },
    { primary: '#2a7a8a', secondary: '#1a5a6a', accent: '#3a9aaa', bg: '#f0f8fa' },
    { primary: '#4a8a6a', secondary: '#2a6a4a', accent: '#6aaa8a', bg: '#f2faf5' },
    { primary: '#2a6a8a', secondary: '#1a4a6a', accent: '#4a9aba', bg: '#f0f5fa' },
    { primary: '#5a8a7a', secondary: '#3a6a5a', accent: '#7aaa9a', bg: '#f5faf8' },
  ];

  const palette = palettes[h % palettes.length];

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`${name} logo`}
    >
      {/* Background */}
      <rect width="120" height="120" rx="24" fill={palette.bg} />

      {/* Abstract pattern background */}
      <circle cx="90" cy="30" r="40" fill={palette.primary} opacity="0.06" />
      <circle cx="30" cy="90" r="35" fill={palette.accent} opacity="0.06" />

      {/* Border accent */}
      <rect
        x="2" y="2" width="116" height="116" rx="22"
        fill="none"
        stroke={palette.primary}
        strokeWidth="1.5"
        opacity="0.2"
      />

      {/* Initials */}
      <text
        x="60"
        y="65"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Josefin Sans', sans-serif"
        fontSize={initials.length > 2 ? '28' : '32'}
        fontWeight="300"
        fill={palette.primary}
        letterSpacing="2"
      >
        {initials}
      </text>

      {/* Underline accent */}
      <line
        x1="36"
        y1="82"
        x2="84"
        y2="82"
        stroke={palette.accent}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
