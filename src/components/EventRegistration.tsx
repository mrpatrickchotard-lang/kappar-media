'use client';

import type { KapparEvent } from '@/lib/events';

interface EventRegistrationProps {
  event: KapparEvent;
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function EventRegistration({ event }: EventRegistrationProps) {
  const isPast = event.status === 'past';
  const isSoldOut = event.status === 'sold-out';
  const capacityPercent = event.capacity && event.registeredCount
    ? Math.round((event.registeredCount / event.capacity) * 100)
    : 0;
  const spotsLeft = event.capacity ? event.capacity - (event.registeredCount || 0) : null;

  return (
    <div
      className="rounded-xl overflow-hidden sticky top-24"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
    >
      {/* Price header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        {event.price === 0 ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-light" style={{ color: 'var(--teal)' }}>Free</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-light" style={{ color: 'var(--text-primary)' }}>${event.price}</span>
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{event.currency}</span>
          </div>
        )}
      </div>

      {/* Event details */}
      <div className="p-6 space-y-4">
        {/* Date */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5" style={{ color: 'var(--teal)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatEventDate(event.date)}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5" style={{ color: 'var(--teal)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{event.location}</p>
            {event.address && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{event.address}</p>
            )}
          </div>
        </div>

        {/* Capacity */}
        {event.capacity && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5" style={{ color: 'var(--teal)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {event.registeredCount || 0} / {event.capacity} registered
              </p>
              {!isPast && (
                <>
                  <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ backgroundColor: 'var(--border-primary)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${capacityPercent}%`,
                        background: capacityPercent > 85 ? '#d4a030' : 'linear-gradient(90deg, var(--teal), var(--accent-emerald))',
                      }}
                    />
                  </div>
                  {spotsLeft !== null && spotsLeft <= 20 && spotsLeft > 0 && (
                    <p className="text-xs mt-1" style={{ color: '#d4a030' }}>
                      Only {spotsLeft} spots remaining
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Speakers count */}
        {event.speakers.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5" style={{ color: 'var(--teal)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {event.speakers.length} speaker{event.speakers.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-6 pt-0">
        {isPast ? (
          <div
            className="w-full py-3 px-6 rounded-lg text-center text-sm font-medium"
            style={{ backgroundColor: 'var(--border-primary)', color: 'var(--text-tertiary)' }}
          >
            This event has ended
          </div>
        ) : isSoldOut ? (
          <div
            className="w-full py-3 px-6 rounded-lg text-center text-sm font-medium"
            style={{ backgroundColor: 'rgba(212,160,48,0.15)', color: '#d4a030' }}
          >
            Sold Out — Join Waitlist
          </div>
        ) : (
          <button
            className="w-full py-3 px-6 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: 'var(--teal)', color: '#f5f3ef' }}
            aria-label={`Register for ${event.title}`}
          >
            Register Now
          </button>
        )}
        {!isPast && !isSoldOut && (
          <p className="text-center text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {event.price === 0 ? 'No payment required' : 'Secure checkout'}
          </p>
        )}
      </div>
    </div>
  );
}
