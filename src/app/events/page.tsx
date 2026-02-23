import type { Metadata } from 'next';
import { getAllEvents, getEventTypes } from '@/lib/events';
import { EventCard } from '@/components/EventCard';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Conferences, workshops, webinars, and networking events organized by Kappar for business leaders in the MENA region.',
  openGraph: {
    title: 'Kappar Events',
    description: 'Conferences, workshops, and networking events for business leaders in the MENA region.',
    url: 'https://kappar.tv/events',
  },
  alternates: {
    canonical: 'https://kappar.tv/events',
  },
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; type?: string }>;
}) {
  const params = await searchParams;
  const allEvents = await getAllEvents();
  const eventTypes = getEventTypes();
  const selectedFilter = params.filter || 'all';
  const selectedType = params.type || '';

  let filteredEvents = allEvents;

  // Filter by status
  if (selectedFilter === 'upcoming') {
    filteredEvents = filteredEvents.filter(e => e.status === 'upcoming' || e.status === 'ongoing' || e.status === 'sold-out');
  } else if (selectedFilter === 'past') {
    filteredEvents = filteredEvents.filter(e => e.status === 'past');
  }

  // Filter by type
  if (selectedType) {
    filteredEvents = filteredEvents.filter(e => e.type.toLowerCase() === selectedType.toLowerCase());
  }

  const typeLabels: Record<string, string> = {
    conference: 'Conference',
    workshop: 'Workshop',
    webinar: 'Webinar',
    networking: 'Networking',
    panel: 'Panel',
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <p className="text-xs font-medium tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--teal)' }}>
          EVENTS
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-light mb-4" style={{ color: 'var(--text-primary)' }}>
          Kappar Events
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Conferences, workshops, and networking experiences designed for business leaders who want to stay ahead.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 mb-10">
        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'all', label: 'All Events' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
          ].map((filter) => (
            <a
              key={filter.key}
              href={`/events?filter=${filter.key}${selectedType ? `&type=${selectedType}` : ''}`}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedFilter === filter.key ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: selectedFilter === filter.key ? '#f5f3ef' : 'var(--text-secondary)',
                border: `1px solid ${selectedFilter === filter.key ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
              }}
            >
              {filter.label}
            </a>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`/events?filter=${selectedFilter}`}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: !selectedType ? 'var(--teal)' : 'transparent',
              color: !selectedType ? '#f5f3ef' : 'var(--text-tertiary)',
              border: `1px solid ${!selectedType ? 'var(--teal)' : 'var(--border-secondary)'}`,
            }}
          >
            All Types
          </a>
          {eventTypes.map((type) => (
            <a
              key={type}
              href={`/events?filter=${selectedFilter}&type=${type}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: selectedType === type ? 'var(--teal)' : 'transparent',
                color: selectedType === type ? '#f5f3ef' : 'var(--text-tertiary)',
                border: `1px solid ${selectedType === type ? 'var(--teal)' : 'var(--border-secondary)'}`,
              }}
            >
              {typeLabels[type] || type}
            </a>
          ))}
        </div>
      </section>

      {/* Events grid */}
      <section className="max-w-6xl mx-auto px-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4" style={{ color: 'var(--teal)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mx-auto">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-lg font-display" style={{ color: 'var(--text-primary)' }}>No events found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Try adjusting your filters or check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Featured event (first upcoming featured) */}
            {selectedFilter !== 'past' && filteredEvents.find(e => e.featured && e.status !== 'past') && (
              <div className="mb-10">
                <EventCard
                  event={filteredEvents.find(e => e.featured && e.status !== 'past')!}
                  featured
                />
              </div>
            )}

            {/* Grid of remaining events */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter(e => !(selectedFilter !== 'past' && e.featured && e.status !== 'past'))
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
