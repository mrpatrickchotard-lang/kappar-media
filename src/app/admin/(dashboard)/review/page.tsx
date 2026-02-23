'use client';

import { useState, useEffect } from 'react';

interface PendingArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  contentType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminReviewPage() {
  const [articles, setArticles] = useState<PendingArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ id: number; title: string } | null>(null);
  const [feedback, setFeedback] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        const pending = (data.articles || []).filter((a: PendingArticle & { status: string }) => a.status === 'pending_review');
        setArticles(pending);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load articles');
        setLoading(false);
      });
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/articles/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve');

      setArticles(prev => prev.filter(a => a.id !== id));
      setSuccessMsg('Article published successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!feedbackModal || !feedback.trim()) return;

    setActionLoading(feedbackModal.id);
    setError('');
    try {
      const res = await fetch(`/api/articles/${feedbackModal.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', feedback: feedback.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject');

      setArticles(prev => prev.filter(a => a.id !== feedbackModal.id));
      setFeedbackModal(null);
      setFeedback('');
      setSuccessMsg('Article sent back to writer with feedback');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Review Queue</h1>
          <p className="text-secondary text-sm mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 mt-4">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }}>
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No articles pending review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map(article => (
            <div
              key={article.id}
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(42,138,122,0.12)', color: 'var(--teal)' }}>
                      {article.category}
                    </span>
                    {article.contentType !== 'text' && (
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                        {article.contentType}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-light text-primary mb-1 truncate">
                    {article.title}
                  </h3>

                  <p className="text-sm text-secondary line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-tertiary">
                    <span>By {article.author}</span>
                    <span className="w-1 h-1 rounded-full bg-tertiary" />
                    <span>Submitted {new Date(article.updatedAt).toLocaleDateString()}</span>
                    {article.tags.length > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-tertiary" />
                        <span>{article.tags.slice(0, 3).join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <a
                    href={`/content/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-xs font-body transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => { setFeedbackModal({ id: article.id, title: article.title }); setFeedback(''); }}
                    disabled={actionLoading === article.id}
                    className="px-4 py-2 rounded-lg text-xs font-body transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ backgroundColor: 'rgba(234,179,8,0.12)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.2)' }}
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => handleApprove(article.id)}
                    disabled={actionLoading === article.id}
                    className="px-4 py-2 rounded-lg text-xs font-body transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--teal)', color: '#fff' }}
                  >
                    {actionLoading === article.id ? 'Approving...' : 'Approve & Publish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <h3 className="font-display text-xl font-light text-primary mb-1">Request Changes</h3>
            <p className="text-xs text-tertiary mb-4 truncate">
              {feedbackModal.title}
            </p>

            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Feedback for the writer
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Explain what needs to be changed..."
              rows={4}
              className="w-full rounded-xl p-4 outline-none resize-none font-body text-sm mb-4"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setFeedbackModal(null); setFeedback(''); }}
                className="px-4 py-2 rounded-lg text-sm font-body"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!feedback.trim() || actionLoading !== null}
                className="px-4 py-2 rounded-lg text-sm font-body disabled:opacity-50"
                style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.3)' }}
              >
                {actionLoading ? 'Sending...' : 'Send Back to Writer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
