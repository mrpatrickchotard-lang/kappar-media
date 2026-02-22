import { redirect } from 'next/navigation';
import { getSessionWithRole } from '@/lib/permissions';
import Link from 'next/link';

export default async function WriterLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionWithRole();

  if (!session) redirect('/admin/login');
  if (session.user.role !== 'writer' && session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-6 w-full">
          <Link href="/" className="font-display text-lg tracking-wide" style={{ color: 'var(--teal)' }}>
            KAPPAR
          </Link>
          <span className="text-xs tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(42,138,122,0.12)', color: 'var(--teal)' }}>
            Writer
          </span>
          <nav className="flex items-center gap-4 ml-6">
            <Link href="/dashboard/writer" className="text-sm font-body hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              My Articles
            </Link>
            <Link href="/dashboard/writer/articles/new" className="text-sm font-body hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              New Article
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
              {session.user.email}
            </span>
            <Link href="/api/auth/signout" className="text-xs font-body hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}
