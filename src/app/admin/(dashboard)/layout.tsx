import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/permissions";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionWithRole();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== 'admin') {
    if (session.user.role === 'writer') redirect('/dashboard/writer');
    if (session.user.role === 'partner') redirect('/dashboard/partner');
    redirect("/admin/login");
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/content', label: 'Articles' },
    { href: '/admin/partners-admin', label: 'Partners' },
    { href: '/admin/events-admin', label: 'Events' },
    { href: '/admin/experts', label: 'Experts' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/database', label: 'Database' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Admin Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 md:px-6"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-3 md:gap-6 w-full">
          <Link href="/admin" className="font-display text-lg tracking-wide shrink-0" style={{ color: 'var(--teal)' }}>
            KAPPAR
          </Link>
          <span className="text-xs tracking-widest uppercase px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            Admin
          </span>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-3 ml-2 overflow-x-auto">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs font-body hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>
              {session.user?.email}
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

      {/* Mobile Nav (below header) */}
      <div
        className="fixed top-14 left-0 right-0 z-40 lg:hidden overflow-x-auto"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <nav className="flex items-center gap-1 px-4 py-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-body hover:opacity-80 transition-opacity whitespace-nowrap px-2 py-1 rounded"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content - extra top padding on mobile for double nav bar */}
      <main className="pt-24 lg:pt-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
        <div className="lg:hidden h-10" /> {/* Spacer for mobile nav */}
        {children}
      </main>
    </div>
  );
}
