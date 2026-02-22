import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Auth error:", error);
    redirect("/admin/login");
  }

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Admin Header */}
      <header className="border-b border-primary bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-display text-lg tracking-wider text-primary">
                KAPPAR ADMIN
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin/content"
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  Content
                </Link>
                <Link
                  href="/admin/experts"
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  Experts
                </Link>
                <Link
                  href="/admin/bookings"
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  Bookings
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-tertiary">{session.user?.email}</span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-secondary hover:text-primary transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
