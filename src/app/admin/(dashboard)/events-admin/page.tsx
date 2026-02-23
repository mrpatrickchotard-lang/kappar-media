'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  type: string;
  category: string | null;
  featured: boolean;
  capacity: number | null;
  registeredCount: number;
  price: number;
  status: string;
  eventStatus: string;
  reviewFeedback: string | null;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(234,179,8,0.12)', text: '#ca8a04', label: 'Draft' },
  pending_review: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Pending Review' },
  published: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', label: 'Published' },
  archived: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280', label: 'Archived' },
};

const eventStatusColors: Record<string, { bg: string; text: string }> = {
  upcoming: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb' },
  ongoing: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a' },
  past: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
  'sold-out': { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
};

const filters = ['all', 'published', 'pending_review', 'draft', 'archived'];
const filterLabels: Record<string, string> = {
  all: 'All',
  published: 'Published',
  pending_review: 'Pending Review',
  draft: 'Drafts',
  archived: 'Archived',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/events-manage')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load events');
        setLoading(false);
      });
  }, []);

  const filteredEvents = activeFilter === 'all'
    ? events
    : events.filter(e => e.status === activeFilter);

  const pendingCount = events.filter(e => e.status === 'pending_review').length;

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/events-manage/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) throw new Error('Failed');
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'published' } : e));
      setSuccessMsg('Event published');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch { setError('Failed to approve'); }
    finally { setActionLoading(null); }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Events</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Events</h1>
          <p className="text-secondary text-sm mt-1">
            {events.length} total events
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#2563eb' }}>
                {pendingCount} pending review
              </span>
            )}
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

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(filter => {
          const count = filter === 'all' ? events.length : events.filter(e => e.status === filter).length;
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

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
        {filteredEvents.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">No events match this filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                {['Event', 'Date', 'Type', 'Event Status', 'Review Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => {
                const sc = statusColors[event.status] || statusColors.draft;
                const es = eventStatusColors[event.eventStatus] || eventStatusColors.upcoming;
                return (
                  <tr key={event.id} style={{ borderBottom: index < filteredEvents.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-body font-medium" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.location || 'No location'}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(42,138,122,0.1)', color: 'var(--teal)' }}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap capitalize" style={{ backgroundColor: es.bg, color: es.text }}>
                        {event.eventStatus || 'upcoming'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/events/${event.slug}`} target="_blank" className="text-xs font-body hover:opacity-80" style={{ color: 'var(--teal)' }}>
                          View
                        </Link>
                        {event.status === 'pending_review' && (
                          <button
                            onClick={() => handleApprove(event.id)}
                            disabled={actionLoading === event.id}
                            className="text-xs font-body hover:opacity-80 disabled:opacity-50"
                            style={{ color: '#16a34a' }}
                          >
                            {actionLoading === event.id ? 'Approving...' : 'Approve'}
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
    </div>
  );
}
