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
  usePagination
} from '@/components/AdminShared';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Event>>({});
  const [archiveConfirm, setArchiveConfirm] = useState<number | null>(null);

  const { sortColumn, sortDirection, handleSort, sortData } = useSortable<Event>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Filter by status
  const statusFiltered = activeFilter === 'all'
    ? events
    : events.filter(e => e.status === activeFilter);

  // Filter by search query (title, location, type)
  const searchFiltered = statusFiltered.filter(e => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      e.type.toLowerCase().includes(q)
    );
  });

  // Apply sorting
  const sortedEvents = sortData(searchFiltered);

  // Apply pagination
  const totalPages = Math.ceil(sortedEvents.length / pageSize);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const handleEditStart = (event: Event) => {
    setEditingId(event.id);
    setEditValues({
      title: event.title,
      date: event.date,
      status: event.status,
    });
  };

  const handleEditSave = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/events-manage/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error('Failed');
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...editValues } : e));
      setSuccessMsg('Event updated');
      setTimeout(() => setSuccessMsg(''), 3000);
      setEditingId(null);
    } catch { setError('Failed to update event'); }
    finally { setActionLoading(null); }
  };

  const handleArchive = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/events-manage/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      if (!res.ok) throw new Error('Failed');
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'archived' } : e));
      setSuccessMsg('Event archived');
      setTimeout(() => setSuccessMsg(''), 3000);
      setArchiveConfirm(null);
    } catch { setError('Failed to archive event'); }
    finally { setActionLoading(null); }
  };

  const handleExportCSV = () => {
    const csvData = searchFiltered.map(e => ({
      ID: e.id,
      Title: e.title,
      Date: new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      Type: e.type,
      Location: e.location || 'N/A',
      'Event Status': e.eventStatus,
      'Review Status': statusColors[e.status]?.label || e.status,
      Registered: e.registeredCount,
      Price: e.price,
    }));

    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(h => {
          const val = row[h as keyof typeof row];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Events</h1>
        <SkeletonTable rows={5} columns={6} className="mt-8" />
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
        <ExportCSVButton data={searchFiltered} filename="events" columns={['title', 'date', 'type', 'location', 'eventStatus', 'status']} />
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

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search by title, location, or type..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(filter => {
          const count = filter === 'all' ? events.length : events.filter(e => e.status === filter).length;
          return (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
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

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
        {searchFiltered.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">No events match this filter.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                    <SortableHeader
                      label="Event"
                      column="title"
                      currentSort={sortColumn}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Date"
                      column="date"
                      currentSort={sortColumn}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Type"
                      column="type"
                      currentSort={sortColumn}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Event Status"
                      column="eventStatus"
                      currentSort={sortColumn}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Review Status"
                      column="status"
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
                  {paginatedEvents.map((event, index) => {
                    const sc = statusColors[event.status] || statusColors.draft;
                    const es = eventStatusColors[event.eventStatus] || eventStatusColors.upcoming;
                    const isEditing = editingId === event.id;

                    return (
                      <tr key={event.id} style={{ borderBottom: index < paginatedEvents.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <div>
                              <input
                                type="text"
                                value={editValues.title || ''}
                                onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                                className="w-full text-sm font-body font-medium p-2 rounded border"
                                style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}
                              />
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                                {event.location || 'No location'}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-body font-medium" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.location || 'No location'}
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editValues.date?.split('T')[0] || ''}
                              onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                              className="text-sm p-2 rounded border"
                              style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}
                            />
                          ) : (
                            <time dateTime={event.date}>
                              {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </time>
                          )}
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
                          {isEditing ? (
                            <select
                              value={editValues.status || ''}
                              onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                              className="text-xs p-1 rounded border"
                              style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}
                            >
                              {Object.entries(statusColors).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                              {sc.label}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleEditSave(event.id)}
                                  disabled={actionLoading === event.id}
                                  className="text-xs font-body hover:opacity-80 disabled:opacity-50"
                                  style={{ color: '#16a34a' }}
                                >
                                  {actionLoading === event.id ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-xs font-body hover:opacity-80"
                                  style={{ color: 'var(--text-tertiary)' }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <Link href={`/events/${event.slug}`} target="_blank" className="text-xs font-body hover:opacity-80" style={{ color: 'var(--teal)' }}>
                                  View
                                </Link>
                                <button
                                  onClick={() => handleEditStart(event)}
                                  className="text-xs font-body hover:opacity-80"
                                  style={{ color: 'var(--teal)' }}
                                >
                                  Edit
                                </button>
                                {event.status !== 'archived' && (
                                  <button
                                    onClick={() => setArchiveConfirm(event.id)}
                                    className="text-xs font-body hover:opacity-80"
                                    style={{ color: '#ef4444' }}
                                  >
                                    Archive
                                  </button>
                                )}
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              total={sortedEvents.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {archiveConfirm && (
        <ConfirmDialog
          open={true}
          title="Archive Event"
          message="Are you sure you want to archive this event? It will no longer be visible in the published list."
          confirmLabel="Archive"
          cancelLabel="Cancel"
          variant="warning"
          onConfirm={() => handleArchive(archiveConfirm)}
          onCancel={() => setArchiveConfirm(null)}
        />
      )}
    </div>
  );
}
