'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'rgba(234,179,8,0.12)', text: '#ca8a04' },
  published: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a' },
  archived: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
};

export default function WriterDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const counts = {
    total: articles.length,
    drafts: articles.filter(a => a.status === 'draft').length,
    published: articles.filter(a => a.status === 'published').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
            My Articles
          </h1>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Create and manage your content
          </p>
        </div>
        <Link
          href="/dashboard/writer/articles/new"
          className="px-5 py-2.5 rounded-xl text-sm font-body transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
        >
          + New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total', value: counts.total },
          { label: 'Drafts', value: counts.drafts },
          { label: 'Published', value: counts.published },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
          >
            <p className="text-2xl font-display font-light" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Articles Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          </div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)' }}>
              No articles yet. Start writing your first article!
            </p>
            <Link
              href="/dashboard/writer/articles/new"
              className="inline-block mt-4 px-5 py-2 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
            >
              Create Article
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Title', 'Category', 'Status', 'Updated', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(article => {
                const sc = statusColors[article.status] || statusColors.draft;
                return (
                  <tr key={article.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {article.title}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: 'var(--teal)' }}>{article.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/writer/articles/${article.slug}`}
                        className="text-xs font-body hover:opacity-80"
                        style={{ color: 'var(--teal)' }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
