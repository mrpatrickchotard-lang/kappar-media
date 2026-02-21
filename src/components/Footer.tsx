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
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6">
              <Logo variant="teal" size={48} />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-light tracking-[0.4em] uppercase text-primary">
                  KAPPAR
                </span>
                <span className="text-[10px] tracking-[0.5em] uppercase text-[var(--mt-tag-dark)]">
                  MEDIA
                </span>
              </div>
            </Link>
            <p className="text-tertiary text-sm leading-relaxed max-w-sm">
              Forward media for business leaders. Insights, interviews, and expert perspectives from Dubai to the world.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase text-secondary mb-6">Content</h4>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase text-secondary mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-tertiary">
            © {new Date().getFullYear()} Kappar Media. All rights reserved.
          </p>
          <p className="text-xs text-tertiary">
            Dubai International Financial Centre, UAE
          </p>
        </div>
      </div>
    </footer>
  );
}
