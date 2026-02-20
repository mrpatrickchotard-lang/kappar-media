'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/content', label: 'Content' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080a]/90 backdrop-blur-md border-b border-[#1a1a1e]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Logo variant="teal" size={40} />
            <div className="hidden sm:flex flex-col">
              <span className="font-display text-xl font-light tracking-[0.35em] uppercase text-[#e8e4df]">
                KAPPAR
              </span>
              <span className="text-[9px] tracking-[0.45em] uppercase text-[#5a8a80]">
                MEDIA
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-[#888] hover:text-[#e8e4df] transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/newsletter"
              className="px-5 py-2.5 bg-[#0c2e2e] text-[#c8c0a0] text-sm font-body rounded-lg hover:bg-[#1a4a4a] transition-colors"
            >
              Subscribe
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#e8e4df]"
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
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-[#1a1a1e]">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-body text-[#888] hover:text-[#e8e4df] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="mt-4 px-5 py-3 bg-[#0c2e2e] text-[#c8c0a0] text-center text-sm font-body rounded-lg"
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
