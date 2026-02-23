'use client';

import React, { useEffect, useState } from 'react';
import { SearchBar, Pagination, ExportCSVButton, SortableHeader, SkeletonTable, useSortable, usePagination } from '@/components/AdminShared';

interface BookingRow {
  id: number;
  bookingId: string;
  expertId: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  hourlyRate: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  meetingLink: string | null;
  createdAt: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(180, 83, 9, 0.1)', text: 'rgb(180, 83, 9)' },
  confirmed: { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(34, 197, 94)' },
  cancelled: { bg: 'rgba(220, 38, 38, 0.1)', text: 'rgb(220, 38, 38)' },
  completed: { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' },
  'in-progress': { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');

  const { sortColumn, sortDirection, handleSort, sortData } = useSortable<BookingRow>();

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load bookings');
        return res.json();
      })
      .then(data => setBookings(data.bookings || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return b.clientName.toLowerCase().includes(q) ||
        b.clientEmail.toLowerCase().includes(q) ||
        b.expertId.toLowerCase().includes(q) ||
        b.topic?.toLowerCase().includes(q);
    });

  const sorted = sortData(filtered);
  const { page, totalPages, total, paginatedData, setPage } = usePagination(sorted, 10);

  const statusFilters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: newStatus } : b));
      setSuccessMsg(`Booking ${newStatus}`);
      setEditingId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setError('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>Bookings</h1>
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>Bookings</h1>
          <p className="text-sm mt-1 font-body" style={{ color: 'var(--text-secondary)' }}>
            {bookings.length} total bookings
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(180,83,9,0.12)', color: 'rgb(180,83,9)' }}>
                {bookings.filter(b => b.status === 'pending').length} pending
              </span>
            )}
          </p>
        </div>
        <ExportCSVButton data={bookings} filename="kappar-bookings" columns={['bookingId', 'clientName', 'clientEmail', 'expertId', 'date', 'startTime', 'status', 'totalAmount']} />
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search bookings..." /></div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(filter => (
            <button key={filter} onClick={() => { setStatusFilter(filter); setPage(1); }}
              className="px-4 py-2 rounded-lg text-xs font-body transition-all capitalize"
              style={{ backgroundColor: statusFilter === filter ? 'var(--teal)' : 'var(--bg-card)', color: statusFilter === filter ? '#fff' : 'var(--text-secondary)', border: `1px solid ${statusFilter === filter ? 'var(--teal)' : 'var(--border-primary)'}` }}>
              {filter} ({filter === 'all' ? bookings.length : bookings.filter(b => b.status === filter).length})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
        {paginatedData.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}><p className="text-sm">No bookings match your search.</p></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                <SortableHeader label="Client" column="clientName" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>Email</th>
                <SortableHeader label="Date" column="date" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="Status" column="status" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="Amount" column="totalAmount" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((booking, index) => {
                const sc = statusColors[booking.status] || { bg: 'var(--bg-primary)', text: 'var(--text-secondary)' };
                return (
                  <React.Fragment key={booking.bookingId}>
                    <tr style={{ borderBottom: index < paginatedData.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                      <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-primary)' }}>{booking.clientName}</td>
                      <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{booking.clientEmail}</td>
                      <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                        <time dateTime={booking.date}>{booking.date} {booking.startTime}</time>
                      </td>
                      <td className="px-5 py-4">
                        {editingId === booking.bookingId ? (
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                            className="text-xs px-2 py-1 rounded font-body"
                            style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>{booking.status}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-body font-medium" style={{ color: 'var(--text-primary)' }}>${booking.totalAmount}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {editingId === booking.bookingId ? (
                            <>
                              <button onClick={() => handleStatusUpdate(booking.bookingId, editStatus)} className="text-xs font-body" style={{ color: '#16a34a' }}>Save</button>
                              <button onClick={() => setEditingId(null)} className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setSelectedBooking(selectedBooking === booking.bookingId ? null : booking.bookingId)}
                                className="text-xs font-body hover:opacity-80" style={{ color: 'var(--teal)' }}>
                                {selectedBooking === booking.bookingId ? 'Close' : 'View'}
                              </button>
                              <button onClick={() => { setEditingId(booking.bookingId); setEditStatus(booking.status); }}
                                className="text-xs font-body hover:opacity-80" style={{ color: '#2563eb' }}>
                                Edit Status
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {selectedBooking === booking.bookingId && (
                      <tr>
                        <td colSpan={6} style={{ padding: '16px 24px', backgroundColor: 'var(--bg-primary)' }}>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider mb-1 font-body" style={{ color: 'var(--text-tertiary)' }}>Client</p>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{booking.clientName}</p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{booking.clientEmail}</p>
                              {booking.clientCompany && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{booking.clientCompany}</p>}
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider mb-1 font-body" style={{ color: 'var(--text-tertiary)' }}>Schedule</p>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}><time dateTime={booking.date}>{booking.date}</time></p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{booking.startTime} – {booking.endTime}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider mb-1 font-body" style={{ color: 'var(--text-tertiary)' }}>Topic</p>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{booking.topic}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider mb-1 font-body" style={{ color: 'var(--text-tertiary)' }}>Meeting</p>
                              {booking.meetingLink ? (
                                <a href={booking.meetingLink} className="text-sm hover:underline" style={{ color: 'var(--teal)' }}>Join Meeting</a>
                              ) : (
                                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No link yet</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}
