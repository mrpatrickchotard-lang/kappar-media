'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/content', label: 'Content' },
  { href: '/events', label: 'Events' },
  { href: '/experts', label: 'Experts' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Focus trap for mobile menu (A6)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
      return;
    }

    if (e.key === 'Tab' && mobileMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Hide on admin/dashboard routes (they have their own headers)
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 90%, transparent)', borderBottom: '1px solid var(--border-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4" aria-label="Kappar Media - Home">
            <Logo variant="teal" size={40} />
            <span className="hidden sm:inline font-display text-xl font-light tracking-[0.35em] uppercase" style={{ color: 'var(--text-primary)' }} aria-hidden="true">
              KAPPAR
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body transition-colors tracking-wide relative"
                style={{
                  color: isActive(link.href) ? 'var(--teal)' : 'var(--text-secondary)',
                }}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--teal)' }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/newsletter"
                className="px-5 py-2.5 text-sm font-body rounded-lg transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }}
              >
                Subscribe
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button — 48x48 touch target (R3) */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              className="relative w-12 h-12 flex items-center justify-center rounded-lg"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`mobile-hamburger-line top-[15px] ${mobileMenuOpen ? 'rotate-45 !top-[22px]' : ''}`} aria-hidden="true"></span>
              <span className={`mobile-hamburger-line top-[22px] ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} aria-hidden="true"></span>
              <span className={`mobile-hamburger-line top-[29px] ${mobileMenuOpen ? '-rotate-45 !top-[22px]' : ''}`} aria-hidden="true"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu with slide animation + focus trap (A6) */}
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal={mobileMenuOpen ? "true" : undefined}
          aria-label="Mobile navigation"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-6" style={{ borderTop: '1px solid var(--border-primary)' }} aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-body py-3 px-4 rounded-lg transition-all"
                  style={{
                    color: isActive(link.href) ? 'var(--teal)' : 'var(--text-secondary)',
                    backgroundColor: isActive(link.href) ? 'rgba(42,138,122,0.1)' : 'transparent',
                    transitionDelay: mobileMenuOpen ? `${i * 50}ms` : '0ms',
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="mt-4 px-5 py-3 text-center text-sm font-body rounded-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#f5f3ef',
                  transitionDelay: mobileMenuOpen ? `${navLinks.length * 50}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                }}
                onClick={() => setMobileMenuOpen(false)}
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                Subscribe
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
