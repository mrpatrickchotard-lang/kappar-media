'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  status: string;
  contentType: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(234,179,8,0.12)', text: '#ca8a04', label: 'Draft' },
  pending_review: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Pending Review' },
  published: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', label: 'Published' },
  archived: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280', label: 'Archived' },
};

const filters = ['all', 'published', 'pending_review', 'draft', 'archived'];
const filterLabels: Record<string, string> = {
  all: 'All',
  published: 'Published',
  pending_review: 'Pending Review',
  draft: 'Drafts',
  archived: 'Archived',
};

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load articles');
        setLoading(false);
      });
  }, []);

  const filteredArticles = activeFilter === 'all'
    ? articles
    : articles.filter(a => a.status === activeFilter);

  const pendingCount = articles.filter(a => a.status === 'pending_review').length;

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
          <p className="text-secondary text-sm mt-1">
            {articles.length} total articles
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#2563eb' }}>
                {pendingCount} pending review
              </span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/writer/articles/new"
          target="_blank"
          className="px-5 py-2.5 rounded-xl text-sm font-body transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--teal)', color: '#fff' }}
        >
          New Article
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(filter => {
          const count = filter === 'all' ? articles.length : articles.filter(a => a.status === filter).length;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-lg text-xs font-body transition-all"
              style={{
                backgroundColor: activeFilter === filter ? 'var(--teal)' : 'var(--bg-card)',
                color: activeFilter === filter ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeFilter === filter ? 'var(--teal)' : 'var(--border-primary)'}`,
              }}
            >
              {filterLabels[filter]} ({count})
            </button>
          );
        })}
      </div>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {filteredArticles.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">No articles match this filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                {['Title', 'Type', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article, index) => {
                const sc = statusColors[article.status] || statusColors.draft;
                return (
                  <tr
                    key={article.id}
                    style={{ borderBottom: index < filteredArticles.length - 1 ? '1px solid var(--border-primary)' : 'none' }}
                  >
                    <td className="px-5 py-4" style={{ maxWidth: '250px' }}>
                      <p className="text-sm font-body font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {article.title}
                      </p>
                      {article.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ backgroundColor: 'rgba(42,138,122,0.12)', color: 'var(--teal)' }}>
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body capitalize" style={{ color: 'var(--text-secondary)' }}>
                        {article.contentType || 'text'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{article.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>{article.author}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <a
                          href={`/content/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-body hover:opacity-80"
                          style={{ color: 'var(--teal)' }}
                        >
                          View
                        </a>
                        {article.status === 'pending_review' && (
                          <Link
                            href="/admin/review"
                            className="text-xs font-body hover:opacity-80"
                            style={{ color: '#2563eb' }}
                          >
                            Review
                          </Link>
                        )}
                      </div>
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
