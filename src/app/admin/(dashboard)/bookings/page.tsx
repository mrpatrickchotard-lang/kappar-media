'use client';

import React, { useEffect, useState } from 'react';
import { getBookings, getExpertById } from '@/lib/expert-db';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Array<{
    id: string;
    expertId: string;
    clientName: string;
    clientEmail: string;
    date: string;
    startTime: string;
    status: string;
    totalAmount: number;
  }>>([]);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const data = getBookings();
      setBookings(data);
      setLoading(false);
    } catch {
      setError('Failed to load bookings');
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(180, 83, 9, 0.1)', text: 'rgb(180, 83, 9)' }; // amber
      case 'confirmed':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(34, 197, 94)' }; // green
      case 'cancelled':
        return { bg: 'rgba(220, 38, 38, 0.1)', text: 'rgb(220, 38, 38)' }; // red
      case 'completed':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' }; // blue
      case 'in-progress':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' }; // blue
      default:
        return { bg: 'var(--bg-primary)', text: 'var(--text-secondary)' };
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Bookings</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Bookings</h1>
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
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Bookings</h1>
          <p className="text-secondary mt-2">Manage expert consultation bookings</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '20px 24px'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0
          }}>
            Total Bookings: {bookings.length}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-body)'
          }}>
            <p>No bookings yet. When experts are booked, they will appear here.</p>
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-primary)'
              }}>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Client</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Email</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Expert</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Date & Time</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Status</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Amount</th>
                <th style={{
                  textAlign: 'right',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border-primary)' }}>
              {bookings.map((booking, index) => {
                const expert = getExpertById(booking.expertId);
                const statusColor = getStatusColor(booking.status);

                return (
                  <React.Fragment key={booking.id}>
                  <tr
                    style={{
                      borderBottom: index < bookings.length - 1 ? '1px solid var(--border-primary)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      maxWidth: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {booking.clientName}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      maxWidth: '180px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {booking.clientEmail}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {expert ? expert.name : 'Unknown Expert'}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} {booking.startTime}
                    </td>
                    <td style={{
                      padding: '16px 24px'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: '11px',
                        borderRadius: '9999px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-body)',
                        textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500
                    }}>
                      ${booking.totalAmount.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      textAlign: 'right'
                    }}>
                      <button
                        onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                        style={{
                          color: 'var(--teal)',
                          fontSize: '13px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'text-decoration 0.2s',
                          fontFamily: 'var(--font-body)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {selectedBooking === booking.id ? 'Close' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {selectedBooking === booking.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: '16px 24px', backgroundColor: 'var(--bg-primary)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                          <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{booking.clientName}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{booking.clientEmail}</p>
                          </div>
                          <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{expert ? expert.name : 'Unknown'}</p>
                          </div>
                          <div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Schedule</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{booking.date} at {booking.startTime}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Status: {booking.status}</p>
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
    </div>
  );
}
