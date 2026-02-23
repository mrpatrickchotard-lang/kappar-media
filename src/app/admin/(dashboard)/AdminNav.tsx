'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/review', label: 'Review Queue' },
  { href: '/admin/content', label: 'Articles' },
  { href: '/admin/partners-admin', label: 'Partners' },
  { href: '/admin/events-admin', label: 'Events' },
  { href: '/admin/experts', label: 'Experts' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/database', label: 'Database' },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Admin Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 md:px-6"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-3 md:gap-6 w-full">
          <Link href="/admin" className="font-display text-lg tracking-wide shrink-0" style={{ color: 'var(--teal)' }}>
            KAPPAR
          </Link>
          <span className="text-xs tracking-widest uppercase px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }} aria-hidden="true">
            Admin
          </span>

          {/* Desktop Nav with active indicator (AD14) */}
          <nav className="hidden lg:flex items-center gap-1 ml-2 overflow-x-auto" aria-label="Admin navigation">
            {navLinks.map(link => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-body transition-all whitespace-nowrap px-3 py-1.5 rounded-lg"
                  style={{
                    color: active ? 'var(--teal)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'rgba(42,138,122,0.1)' : 'transparent',
                    fontWeight: active ? 500 : 400,
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs font-body hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>
              {email}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-xs font-body hover:opacity-80"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Nav (below header) with active indicator */}
      <div
        className="fixed top-14 left-0 right-0 z-40 lg:hidden overflow-x-auto"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <nav className="flex items-center gap-1 px-4 py-2" aria-label="Admin navigation">
          {navLinks.map(link => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-body transition-all whitespace-nowrap px-2 py-1 rounded"
                style={{
                  color: active ? 'var(--teal)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'rgba(42,138,122,0.1)' : 'transparent',
                  fontWeight: active ? 500 : 400,
                }}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
