import Link from 'next/link';
import type { KapparEvent } from '@/lib/events';
import { EventCardVisual } from './EventCardVisual';

interface EventCardProps {
  event: KapparEvent;
  featured?: boolean;
}

function formatEventDate(dateStr: string): { day: string; month: string; weekday: string } {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  };
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

const typeLabels: Record<string, string> = {
  conference: 'Conference',
  workshop: 'Workshop',
  webinar: 'Webinar',
  networking: 'Networking',
  panel: 'Panel',
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: 'rgba(42,138,122,0.15)', text: 'var(--teal)', label: 'Upcoming' },
  ongoing: { bg: 'rgba(74,186,138,0.15)', text: 'var(--accent-emerald)', label: 'Happening Now' },
  past: { bg: 'rgba(100,100,100,0.15)', text: 'var(--text-tertiary)', label: 'Past Event' },
  'sold-out': { bg: 'rgba(212,160,48,0.15)', text: '#d4a030', label: 'Sold Out' },
};

export function EventCard({ event, featured = false }: EventCardProps) {
  const { day, month } = formatEventDate(event.date);
  const status = statusStyles[event.status] || statusStyles.upcoming;
  const isPast = event.status === 'past';
  const capacityPercent = event.capacity && event.registeredCount
    ? Math.round((event.registeredCount / event.capacity) * 100)
    : 0;

  if (featured) {
    return (
      <Link href={`/events/${event.slug}`} className="block group">
        <div
          className="rounded-xl overflow-hidden card-hover"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Visual */}
            <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
              <EventCardVisual type={event.type} slug={event.slug} />
              {/* Date badge */}
              <div className="absolute top-4 left-4 rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="px-3 py-1 text-center" style={{ backgroundColor: 'var(--teal)' }}>
                  <span className="text-xs font-bold tracking-wider text-white">{month}</span>
                </div>
                <div className="px-3 py-1 text-center">
                  <span className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{day}</span>
                </div>
              </div>
              {/* Type badge */}
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#f5f3ef' }}
              >
                {typeLabels[event.type] || event.type}
              </div>
            </div>
            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    {status.label}
                  </span>
                  {event.price === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(74,186,138,0.15)', color: 'var(--accent-emerald)' }}>
                      Free
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-display font-light mb-3 group-hover:text-[var(--teal)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {event.title}
                </h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {event.description}
                </p>
              </div>
              <div>
                {/* Details row */}
                <div className="flex flex-wrap items-center gap-4 text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                    {formatTime(event.startTime)} – {formatTime(event.endTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location}
                  </span>
                </div>
                {/* Capacity bar */}
                {event.capacity && !isPast && (
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{event.registeredCount} registered</span>
                      <span>{event.capacity - (event.registeredCount || 0)} spots left</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-primary)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${capacityPercent}%`,
                          background: capacityPercent > 85 ? '#d4a030' : 'linear-gradient(90deg, var(--teal), var(--accent-emerald))',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div
        className={`rounded-xl overflow-hidden h-full flex flex-col card-hover-light ${isPast ? 'opacity-75' : ''}`}
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
      >
        {/* Visual with date badge */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <EventCardVisual type={event.type} slug={event.slug} />
          {/* Date badge */}
          <div className="absolute top-3 left-3 rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="px-2.5 py-0.5 text-center" style={{ backgroundColor: 'var(--teal)' }}>
              <span className="text-[10px] font-bold tracking-wider text-white">{month}</span>
            </div>
            <div className="px-2.5 py-0.5 text-center">
              <span className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>{day}</span>
            </div>
          </div>
          {/* Type badge */}
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#f5f3ef' }}
          >
            {typeLabels[event.type] || event.type}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {status.label}
            </span>
            {event.price === 0 && !isPast && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(74,186,138,0.15)', color: 'var(--accent-emerald)' }}>
                Free
              </span>
            )}
            {event.price > 0 && !isPast && (
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                ${event.price}
              </span>
            )}
          </div>

          <h3 className="text-lg font-display font-light mb-2 group-hover:text-[var(--teal)] transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {event.title}
          </h3>

          <p className="text-xs mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-secondary)' }}>
            {event.description}
          </p>

          {/* Details */}
          <div className="flex flex-col gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </span>
          </div>

          {/* Capacity bar */}
          {event.capacity && !isPast && (
            <div className="mt-3">
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-primary)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${capacityPercent}%`,
                    background: capacityPercent > 85 ? '#d4a030' : 'linear-gradient(90deg, var(--teal), var(--accent-emerald))',
                  }}
                />
              </div>
              <span className="text-[10px] mt-1 block" style={{ color: 'var(--text-tertiary)' }}>
                {event.capacity - (event.registeredCount || 0)} spots left
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
