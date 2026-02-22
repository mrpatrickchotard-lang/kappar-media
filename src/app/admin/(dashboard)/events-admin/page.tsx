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
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load events');
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)' };
      case 'ongoing':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' };
      case 'completed':
        return { bg: 'rgba(107, 114, 128, 0.1)', color: 'rgb(107, 114, 128)' };
      case 'cancelled':
        return { bg: 'rgba(220, 38, 38, 0.1)', color: 'rgb(220, 38, 38)' };
      case 'past':
        return { bg: 'rgba(107, 114, 128, 0.1)', color: 'rgb(107, 114, 128)' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-secondary)' };
    }
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

  if (error) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Events</h1>
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
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Events</h1>
          <p className="text-secondary mt-2">Manage upcoming and past events</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-primary)',
            padding: '20px 24px',
          }}
        >
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Total Events: {events.length}
          </p>
        </div>

        {events.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
            }}
          >
            <p>No events yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border-primary)',
                }}
              >
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Event
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Location
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border-primary)' }}>
              {events.map((event, index) => {
                const statusStyle = getStatusStyle(event.status);
                return (
                  <tr
                    key={event.id}
                    style={{
                      borderBottom:
                        index < events.length - 1
                          ? '1px solid var(--border-primary)'
                          : 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div>
                        <p
                          style={{
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {event.title}
                        </p>
                        <p
                          style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '12px',
                            margin: '4px 0 0',
                            maxWidth: '300px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {event.description}
                        </p>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '16px 24px',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                      }}
                    >
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td
                      style={{
                        padding: '16px 24px',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {event.location || '—'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: 'rgba(42, 138, 122, 0.1)',
                          color: 'var(--teal)',
                          fontSize: '11px',
                          borderRadius: '9999px',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: '11px',
                          borderRadius: '9999px',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <Link
                        href={`/events/${event.slug}`}
                        style={{
                          color: 'var(--teal)',
                          fontSize: '13px',
                          textDecoration: 'none',
                        }}
                      >
                        View
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
