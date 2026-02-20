interface LogoProps {
  className?: string;
  variant?: 'teal' | 'emerald' | 'light' | 'dark';
  size?: number;
}

export function Logo({ className = '', variant = 'teal', size = 40 }: LogoProps) {
  const colors = {
    teal: { disc: '#0c2e2e', symbol: '#c8c0a0' },
    emerald: { disc: '#4aba8a', symbol: '#0a0a0a' },
    light: { disc: '#ffffff', symbol: '#0a0a0a' },
    dark: { disc: '#0a0a0a', symbol: '#ffffff' },
  };
  
  const { disc, symbol } = colors[variant];
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      className={className}
    >
      <circle cx="34" cy="34" r="32" fill={disc} />
      <path
        d="M 16 21 L 38 34 L 16 47"
        stroke={symbol}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="45" y="21" width="4" height="26" rx="2" fill={symbol} />
    </svg>
  );
}

interface LogoWithTextProps extends LogoProps {
  showTagline?: boolean;
}

export function LogoWithText({ 
  className = '', 
  variant = 'teal', 
  size = 48,
  showTagline = true 
}: LogoWithTextProps) {
  const textColor = variant === 'emerald' ? '#0a0a0a' : '#e8e4df';
  const taglineColor = variant === 'teal' ? '#5a8a80' : '#3a6a5e';
  
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <Logo variant={variant} size={size} />
      <div className="flex flex-col">
        <span 
          className="font-display text-2xl font-light tracking-[0.4em] uppercase"
          style={{ color: textColor }}
        >
          KAPPAR
        </span>
        {showTagline && (
          <span 
            className="text-[10px] tracking-[0.5em] uppercase font-body"
            style={{ color: taglineColor }}
          >
            MEDIA
          </span>
        )}
      </div>
    </div>
  );
}
