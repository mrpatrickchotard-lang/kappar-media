import Link from 'next/link';
import { Logo } from './Logo';

const footerLinks = {
  content: [
    { href: '/content', label: 'Articles' },
    { href: '/content?type=video', label: 'Video' },
    { href: '/content?type=podcast', label: 'Podcast' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/partner', label: 'Partner With Us' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1e]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6">
              <Logo variant="teal" size={48} />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-light tracking-[0.4em] uppercase text-[#e8e4df]">
                  KAPPAR
                </span>
                <span className="text-[10px] tracking-[0.5em] uppercase text-[#5a8a80]">
                  MEDIA
                </span>
              </div>
            </Link>
            <p className="text-[#666] text-sm leading-relaxed max-w-sm">
              Forward media for business leaders. Insights, interviews, and expert perspectives from Dubai to the world.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase text-[#888] mb-6">Content</h4>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#666] hover:text-[#e8e4df] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase text-[#888] mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#666] hover:text-[#e8e4df] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] uppercase text-[#888] mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#666] hover:text-[#e8e4df] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1e] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#444]">
            © {new Date().getFullYear()} Kappar Media. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#555] hover:text-[#e8e4df] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-[#555] hover:text-[#e8e4df] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-[#555] hover:text-[#e8e4df] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
