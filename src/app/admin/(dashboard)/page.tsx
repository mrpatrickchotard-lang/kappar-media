'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getExperts, getBookings } from '@/lib/expert-db';
import { getAllArticles } from '@/lib/content';

interface DashboardStats {
  totalExperts: number;
  featuredExperts: number;
  totalBookings: number;
  pendingBookings: number;
  totalArticles: number;
  featuredArticles: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const experts = getExperts();
        const bookings = getBookings();
        const articles = await getAllArticles();

        setStats({
          totalExperts: experts.length,
          featuredExperts: experts.filter((e: { featured?: boolean }) => e.featured).length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: { status?: string }) => b.status === 'pending').length,
          totalArticles: articles.length,
          featuredArticles: articles.filter((a: { featured?: boolean }) => a.featured).length,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Dashboard</h1>
        <p className="text-secondary mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Dashboard</h1>
        <p className="text-secondary mt-2">Overview of your Kappar Media platform</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          href="/admin/experts"
          className="bg-card border border-primary rounded-2xl p-6 hover:border-secondary transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full accent-primary flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--accent-gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="text-3xl font-light text-primary">{stats.totalExperts}</span>
          </div>
          <h3 className="font-display text-lg text-primary mb-1">Experts</h3>
          <p className="text-sm text-tertiary">{stats.featuredExperts} featured</p>
        </Link>

        <Link
          href="/admin/bookings"
          className="bg-card border border-primary rounded-2xl p-6 hover:border-secondary transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full accent-primary flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--accent-gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-3xl font-light text-primary">{stats.totalBookings}</span>
          </div>
          <h3 className="font-display text-lg text-primary mb-1">Bookings</h3>
          <p className="text-sm text-tertiary">{stats.pendingBookings} pending</p>
        </Link>

        <Link
          href="/admin/content"
          className="bg-card border border-primary rounded-2xl p-6 hover:border-secondary transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full accent-primary flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--accent-gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <span className="text-3xl font-light text-primary">{stats.totalArticles}</span>
          </div>
          <h3 className="font-display text-lg text-primary mb-1">Articles</h3>
          <p className="text-sm text-tertiary">{stats.featuredArticles} featured</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card border border-primary rounded-2xl p-6">
          <h3 className="font-display text-lg text-primary mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/writer/articles/new"
              className="flex items-center gap-3 p-4 bg-primary rounded-xl hover:border-secondary border border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(58,170,154,0.15)' }}>
                <svg
                  className="w-5 h-5"
                  style={{ color: 'var(--accent-emerald)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-primary">New Article</span>
            </Link>

            <Link
              href="/admin/experts"
              className="flex items-center gap-3 p-4 bg-primary rounded-xl hover:border-secondary border border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(58,170,154,0.15)' }}>
                <svg
                  className="w-5 h-5"
                  style={{ color: 'var(--accent-emerald)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <span className="text-primary">Manage Experts</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-4 bg-primary rounded-xl hover:border-secondary border border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(58,170,154,0.15)' }}>
                <svg
                  className="w-5 h-5"
                  style={{ color: 'var(--accent-emerald)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <span className="text-primary">Manage Users</span>
            </Link>

            <Link
              href="/admin/database"
              className="flex items-center gap-3 p-4 bg-primary rounded-xl hover:border-secondary border border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(58,170,154,0.15)' }}>
                <svg
                  className="w-5 h-5"
                  style={{ color: 'var(--accent-emerald)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <span className="text-primary">Browse Database</span>
            </Link>
          </div>
        </div>

        <div className="bg-card border border-primary rounded-2xl p-6">
          <h3 className="font-display text-lg text-primary mb-6">Recent Activity</h3>
          <p className="text-tertiary text-sm">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
