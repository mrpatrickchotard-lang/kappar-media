'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  SearchBar,
  Pagination,
  ExportCSVButton,
  SortableHeader,
  ConfirmDialog,
  SkeletonTable,
  useSortable,
  usePagination,
} from '@/components/AdminShared';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const { sortColumn, sortDirection, handleSort, sortData } = useSortable<Article>();

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

  const filteredArticles = (() => {
    let filtered = activeFilter === 'all'
      ? articles
      : articles.filter(a => a.status === activeFilter);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query)
      );
    }

    return sortData(filtered);
  })();

  const { page: currentPage, totalPages, paginatedData: paginatedArticles, setPage: goToPage } = usePagination(filteredArticles, 10);

  const handleArchive = async () => {
    if (!selectedArticleId) return;

    try {
      const response = await fetch(`/api/articles/${selectedArticleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });

      if (response.ok) {
        setArticles(articles.map(a =>
          a.id === selectedArticleId ? { ...a, status: 'archived' } : a
        ));
        setArchiveDialogOpen(false);
        setSelectedArticleId(null);
      }
    } catch (err) {
      console.error('Failed to archive article:', err);
    }
  };

  const pendingCount = articles.filter(a => a.status === 'pending_review').length;

  const exportData = paginatedArticles.map(a => ({
    Title: a.title,
    Category: a.category,
    Author: a.author,
    Status: statusColors[a.status]?.label || a.status,
    Date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
        <div className="mt-8">
          <SkeletonTable rows={5} columns={7} />
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
              onClick={() => {
                setActiveFilter(filter);
                goToPage(1);
              }}
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

      {/* Search Bar and Export */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <div className="flex-1 min-w-[250px]">
          <SearchBar
            placeholder="Search by title, category, or author..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <ExportCSVButton
          data={exportData}
          filename="articles"
        />
      </div>

      {/* Table Wrapper */}
      <div className="admin-table-wrapper" style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {paginatedArticles.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">No articles match your search or filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                <SortableHeader
                  label="Title"
                  column="title"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  Type
                </th>
                <SortableHeader
                  label="Category"
                  column="category"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Author"
                  column="author"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Status"
                  column="status"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Date"
                  column="createdAt"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((article, index) => {
                const sc = statusColors[article.status] || statusColors.draft;
                return (
                  <tr
                    key={article.id}
                    style={{ borderBottom: index < paginatedArticles.length - 1 ? '1px solid var(--border-primary)' : 'none' }}
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
                      <time
                        className="text-xs font-body"
                        dateTime={article.createdAt}
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 flex-wrap">
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
                        {article.status === 'published' && (
                          <button
                            onClick={() => {
                              setSelectedArticleId(article.id);
                              setArchiveDialogOpen(true);
                            }}
                            className="text-xs font-body hover:opacity-80"
                            style={{ color: '#6b7280' }}
                          >
                            Archive
                          </button>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        open={archiveDialogOpen}
        title="Archive Article"
        message="Are you sure you want to archive this article? It can be restored later."
        confirmLabel="Archive"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleArchive}
        onCancel={() => {
          setArchiveDialogOpen(false);
          setSelectedArticleId(null);
        }}
      />
    </div>
  );
}
