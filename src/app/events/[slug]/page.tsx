import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllEvents, getEventBySlug, getUpcomingEvents } from '@/lib/events';
import { EventRegistration } from '@/components/EventRegistration';
import { EventCard } from '@/components/EventCard';
import { EventCardVisual } from '@/components/EventCardVisual';
import { sanitizeHtml } from '@/lib/sanitize';

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: `${event.title} | Kappar Events`,
    description: event.description,
  };
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

const typeLabels: Record<string, string> = {
  conference: 'Conference',
  workshop: 'Workshop',
  webinar: 'Webinar',
  networking: 'Networking',
  panel: 'Panel',
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = getUpcomingEvents(3).filter(e => e.slug !== event.slug).slice(0, 2);
  const isPast = event.status === 'past';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm mb-8 hover:text-[var(--teal)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* Hero visual */}
        <div className="relative rounded-xl overflow-hidden mb-8 aspect-[21/7]">
          <EventCardVisual type={event.type} slug={event.slug} />
          {/* Type + status overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#f5f3ef' }}
            >
              {typeLabels[event.type] || event.type}
            </span>
            {isPast && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(100,100,100,0.5)', color: '#ccc' }}
              >
                Past Event
              </span>
            )}
          </div>
          {/* Category tag */}
          <div className="absolute top-4 right-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#f5f3ef' }}
            >
              {event.category}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Title section */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px solid var(--border-primary)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-light mb-4" style={{ color: 'var(--text-primary)' }}>
                {event.title}
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {event.description}
              </p>
            </div>

            {/* Quick info bar */}
            <div
              className="flex flex-wrap gap-6 p-4 rounded-lg mb-8"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatEventDate(event.date)}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </div>
            </div>

            {/* Content */}
            <div
              className="article-content mb-12"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.content) }}
            />

            {/* Speakers */}
            {event.speakers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-display font-light mb-6" style={{ color: 'var(--text-primary)' }}>
                  {event.type === 'panel' ? 'Panelists' : 'Speakers'}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.speakers.map((speaker, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: 'var(--teal)', color: '#f5f3ef' }}
                      >
                        <span className="text-lg font-display">{speaker.name.charAt(0)}</span>
                      </div>
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {speaker.name}
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {speaker.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {speaker.company}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related events */}
            {relatedEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-light mb-6" style={{ color: 'var(--text-primary)' }}>
                  More Upcoming Events
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <EventRegistration event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
