'use client';

import Link from 'next/link';
import { Logo } from './Logo';

const footerLinks = {
  content: [
    { href: '/content', label: 'Articles' },
    { href: '/events', label: 'Events' },
    { href: '/experts', label: 'Experts' },
    { href: '/partners', label: 'Partners' },
    { href: '/newsletter', label: 'Newsletter' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
};

const socialLinks = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/kappartv',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/kappar-media',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/kappartv',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6">
              <Logo variant="teal" size={48} />
              <span className="font-display text-2xl font-light tracking-[0.4em] uppercase" style={{ color: 'var(--text-primary)' }}>
                KAPPAR
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Forward media for business leaders. Insights, interviews, and expert perspectives from Dubai to the world.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg transition-all hover:scale-110"
                  style={{
                    color: 'var(--text-tertiary)',
                    backgroundColor: 'rgba(42,138,122,0.08)',
                    border: '1px solid var(--border-primary)',
                  }}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text-secondary)' }}>Content</h4>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-[var(--teal)]" style={{ color: 'var(--text-tertiary)' }}>
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
                  <Link href={link.href} className="text-sm transition-colors hover:text-[var(--teal)]" style={{ color: 'var(--text-tertiary)' }}>
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

          <div className="flex items-center gap-6">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Dubai International Financial Centre, UAE
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg transition-all hover:-translate-y-1 hover:shadow-md"
              style={{
                backgroundColor: 'rgba(42,138,122,0.1)',
                border: '1px solid var(--border-primary)',
                color: 'var(--teal)',
              }}
              aria-label="Back to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
