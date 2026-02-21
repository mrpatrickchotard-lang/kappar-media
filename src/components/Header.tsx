'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/content', label: 'Content' },
  { href: '/experts', label: 'Experts' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Logo variant="teal" size={40} />
            <div className="hidden sm:flex flex-col">
              <span className="font-display text-xl font-light tracking-[0.35em] uppercase text-primary">
                KAPPAR
              </span>
              <span className="text-[9px] tracking-[0.45em] uppercase text-[var(--mt-tag-dark)]">
                MEDIA
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-secondary hover:text-primary transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/newsletter"
                className="px-5 py-2.5 accent-primary text-[var(--accent-gold)] text-sm font-body rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="p-2 text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-primary">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-body text-secondary hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="mt-4 px-5 py-3 accent-primary text-[var(--accent-gold)] text-center text-sm font-body rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscribe
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
