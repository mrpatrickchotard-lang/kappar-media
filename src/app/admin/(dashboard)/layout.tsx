import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/permissions";
import Link from "next/link";

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
    // Non-admin users get redirected to their dashboards
    if (session.user.role === 'writer') redirect('/dashboard/writer');
    if (session.user.role === 'partner') redirect('/dashboard/partner');
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Admin Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-6 w-full">
          <Link href="/admin" className="font-display text-lg tracking-wide" style={{ color: 'var(--teal)' }}>
            KAPPAR
          </Link>
          <span className="text-xs tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            Admin
          </span>
          <nav className="hidden md:flex items-center gap-4 ml-4">
            {[
              { href: '/admin', label: 'Dashboard' },
              { href: '/admin/content', label: 'Articles' },
              { href: '/admin/partners', label: 'Partners' },
              { href: '/admin/events-manage', label: 'Events' },
              { href: '/admin/experts', label: 'Experts' },
              { href: '/admin/users', label: 'Users' },
              { href: '/admin/bookings', label: 'Bookings' },
              { href: '/admin/database', label: 'Database' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
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

      <main className="pt-14 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
