import Link from 'next/link';
import { Logo } from './Logo';

const footerLinks = {
  content: [
    { href: '/content', label: 'Articles' },
    { href: '/experts', label: 'Experts' },
    { href: '/newsletter', label: 'Newsletter' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6">
              <Logo variant="teal" size={48} />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-light tracking-[0.4em] uppercase" style={{ color: 'var(--text-primary)' }}>
                  KAPPAR
                </span>
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: 'var(--teal)' }}>
                  MEDIA
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-tertiary)' }}>
              Forward media for business leaders. Insights, interviews, and expert perspectives from Dubai to the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text-secondary)' }}>Content</h4>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text-secondary)' }}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} Kappar Media. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Dubai International Financial Centre, UAE
          </p>
        </div>
      </div>
    </footer>
  );
}
