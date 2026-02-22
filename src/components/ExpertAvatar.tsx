// Polished expert avatar with unique generative pattern per expert

interface ExpertAvatarProps {
  name: string;
  id: string;
  size?: number;
  className?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function ExpertAvatar({ name, id, size = 64, className = '' }: ExpertAvatarProps) {
  const h = hashCode(id);
  const initial = name.charAt(0).toUpperCase();

  // Unique subtle background pattern per expert
  const hue = 160 + (h % 30); // Stay in teal range (160-190)
  const patternRotation = h % 360;
  const ringOffset = 3 + (h % 4);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ borderRadius: '50%' }}
    >
      <defs>
        <linearGradient id={`avatar-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue}, 55%, 38%)`} />
          <stop offset="100%" stopColor={`hsl(${hue + 15}, 50%, 28%)`} />
        </linearGradient>
        <clipPath id={`avatar-clip-${id}`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>

      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill={`url(#avatar-grad-${id})`} />

      {/* Decorative pattern inside circle */}
      <g clipPath={`url(#avatar-clip-${id})`} opacity="0.15">
        <circle
          cx={20 + (h % 24)}
          cy={20 + ((h >> 4) % 24)}
          r={ringOffset * 6}
          fill="none"
          stroke="#f5f3ef"
          strokeWidth="0.5"
          transform={`rotate(${patternRotation} 32 32)`}
        />
        <circle
          cx={32 + ((h >> 2) % 16) - 8}
          cy={32 + ((h >> 6) % 16) - 8}
          r={ringOffset * 4}
          fill="none"
          stroke="#f5f3ef"
          strokeWidth="0.5"
        />
      </g>

      {/* Outer ring accent */}
      <circle cx="32" cy="32" r="30.5" fill="none" stroke="rgba(245,243,239,0.15)" strokeWidth="1" />

      {/* Initial letter */}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f5f3ef"
        fontSize="22"
        fontFamily="'Josefin Sans', sans-serif"
        fontWeight="300"
        letterSpacing="0.05em"
      >
        {initial}
      </text>
    </svg>
  );
}
