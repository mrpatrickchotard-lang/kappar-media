'use client';

import { useState, useEffect } from 'react';

type ContentType = 'article' | 'event' | 'expert' | 'partner';

interface PendingItem {
  id: number;
  type: ContentType;
  title: string;
  subtitle: string;
  previewUrl: string;
  updatedAt: string;
}

const typeColors: Record<ContentType, { bg: string; text: string; label: string }> = {
  article: { bg: 'rgba(42,138,122,0.12)', text: 'var(--teal)', label: 'Article' },
  event: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Event' },
  expert: { bg: 'rgba(212,175,55,0.15)', text: '#ca8a04', label: 'Expert' },
  partner: { bg: 'rgba(168,85,247,0.12)', text: '#9333ea', label: 'Partner' },
};

const reviewEndpoints: Record<ContentType, string> = {
  article: '/api/articles',
  event: '/api/events-manage',
  expert: '/api/experts-manage',
  partner: '/api/partners-manage',
};

const contentFilters: ContentType[] = ['article', 'event', 'expert', 'partner'];

export default function AdminReviewPage() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<PendingItem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeType, setActiveType] = useState<'all' | ContentType>('all');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [articlesRes, eventsRes, expertsRes, partnersRes] = await Promise.all([
        fetch('/api/articles').then(r => r.json()).catch(() => ({ articles: [] })),
        fetch('/api/events-manage').then(r => r.json()).catch(() => ({ events: [] })),
        fetch('/api/experts-manage').then(r => r.json()).catch(() => ({ experts: [] })),
        fetch('/api/partners-manage').then(r => r.json()).catch(() => ({ partners: [] })),
      ]);

      const pending: PendingItem[] = [];

      // Articles
      for (const a of (articlesRes.articles || [])) {
        if (a.status === 'pending_review') {
          pending.push({
            id: a.id,
            type: 'article',
            title: a.title,
            subtitle: `By ${a.author} · ${a.category}`,
            previewUrl: `/content/${a.slug}`,
            updatedAt: a.updatedAt,
          });
        }
      }

      // Events
      for (const e of (eventsRes.events || [])) {
        if (e.status === 'pending_review') {
          pending.push({
            id: e.id,
            type: 'event',
            title: e.title,
            subtitle: `${e.type} · ${new Date(e.date).toLocaleDateString()}`,
            previewUrl: `/events/${e.slug}`,
            updatedAt: e.updatedAt || e.createdAt,
          });
        }
      }

      // Experts
      for (const ex of (expertsRes.experts || [])) {
        if (ex.status === 'pending_review') {
          pending.push({
            id: ex.id,
            type: 'expert',
            title: ex.name,
            subtitle: `${ex.title} at ${ex.company}`,
            previewUrl: `/experts/${ex.expertId}`,
            updatedAt: ex.updatedAt || ex.createdAt,
          });
        }
      }

      // Partners
      for (const p of (partnersRes.partners || [])) {
        if (p.status === 'pending_review') {
          pending.push({
            id: p.id,
            type: 'partner',
            title: p.name,
            subtitle: `${p.industry} · ${p.partnershipType}`,
            previewUrl: `/partners/${p.slug}`,
            updatedAt: p.updatedAt || p.createdAt,
          });
        }
      }

      // Sort newest first
      pending.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      setItems(pending);
      setLoading(false);
    } catch {
      setError('Failed to load review queue');
      setLoading(false);
    }
  };

  const getReviewUrl = (item: PendingItem) => {
    const base = reviewEndpoints[item.type];
    return `${base}/${item.id}/review`;
  };

  const handleApprove = async (item: PendingItem) => {
    setActionLoading(item.id);
    setError('');
    try {
      const res = await fetch(getReviewUrl(item), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve');

      setItems(prev => prev.filter(i => !(i.id === item.id && i.type === item.type)));
      setSuccessMsg(`${typeColors[item.type].label} published successfully`);
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
      const res = await fetch(getReviewUrl(feedbackModal), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', feedback: feedback.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject');

      setItems(prev => prev.filter(i => !(i.id === feedbackModal.id && i.type === feedbackModal.type)));
      setFeedbackModal(null);
      setFeedback('');
      setSuccessMsg(`${typeColors[feedbackModal.type].label} sent back with feedback`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredItems = activeType === 'all'
    ? items
    : items.filter(i => i.type === activeType);

  const getCounts = () => {
    const counts: Record<string, number> = { all: items.length };
    for (const t of contentFilters) {
      counts[t] = items.filter(i => i.type === t).length;
    }
    return counts;
  };

  const counts = getCounts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Review Queue</h1>
          <p className="text-secondary text-sm mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''} pending review
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

      {/* Type Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveType('all')}
          className="px-4 py-2 rounded-lg text-xs font-body transition-all"
          style={{
            backgroundColor: activeType === 'all' ? 'var(--teal)' : 'var(--bg-card)',
            color: activeType === 'all' ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${activeType === 'all' ? 'var(--teal)' : 'var(--border-primary)'}`,
          }}
        >
          All ({counts.all})
        </button>
        {contentFilters.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className="px-4 py-2 rounded-lg text-xs font-body transition-all"
            style={{
              backgroundColor: activeType === type ? 'var(--teal)' : 'var(--bg-card)',
              color: activeType === type ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeType === type ? 'var(--teal)' : 'var(--border-primary)'}`,
            }}
          >
            {typeColors[type].label}s ({counts[type]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 mt-4">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }}>
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {activeType === 'all' ? 'No items pending review' : `No ${typeColors[activeType as ContentType].label.toLowerCase()}s pending review`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => {
            const tc = typeColors[item.type];
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="rounded-xl p-6"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: tc.bg, color: tc.text }}>
                        {tc.label}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-light text-primary mb-1 truncate">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-tertiary">
                      <span>{item.subtitle}</span>
                      <span className="w-1 h-1 rounded-full bg-tertiary" />
                      <span>Submitted {new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <a
                      href={item.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-xs font-body transition-opacity hover:opacity-80"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                    >
                      Preview
                    </a>
                    <button
                      onClick={() => { setFeedbackModal(item); setFeedback(''); }}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 rounded-lg text-xs font-body transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ backgroundColor: 'rgba(234,179,8,0.12)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.2)' }}
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 rounded-lg text-xs font-body transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--teal)', color: '#fff' }}
                    >
                      {actionLoading === item.id ? 'Approving...' : 'Approve & Publish'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <h3 className="font-display text-xl font-light text-primary mb-1">Request Changes</h3>
            <p className="text-xs text-tertiary mb-4 truncate">
              <span className="text-xs px-1.5 py-0.5 rounded mr-1" style={{ backgroundColor: typeColors[feedbackModal.type].bg, color: typeColors[feedbackModal.type].text }}>
                {typeColors[feedbackModal.type].label}
              </span>
              {feedbackModal.title}
            </p>

            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Feedback
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
                {actionLoading ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
