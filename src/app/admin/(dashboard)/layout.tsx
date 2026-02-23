import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/permissions";
import { AdminNav } from "./AdminNav";

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <AdminNav email={session.user?.email || ''} />
      {/* Main content - extra top padding on mobile for double nav bar */}
      <main className="pt-24 lg:pt-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
        <div className="lg:hidden h-10" /> {/* Spacer for mobile nav */}
        {children}
      </main>
    </div>
  );
}
