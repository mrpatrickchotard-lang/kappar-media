// Events data library — DB-backed with in-memory fallback
// Public functions only return events where status = 'published'

import { getDb } from './db';
import { events as eventsTable } from './schema';
import { eq, desc, asc, and, or, ne } from 'drizzle-orm';

export interface EventSpeaker {
  name: string;
  title: string;
  company: string;
}

export interface KapparEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  type: 'conference' | 'workshop' | 'webinar' | 'networking' | 'panel';
  category: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  speakers: EventSpeaker[];
  capacity?: number;
  registeredCount?: number;
  price: number;
  currency: string;
  registrationUrl?: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'sold-out';
}

// ========================
// In-memory fallback data
// ========================
const fallbackEvents: KapparEvent[] = [
  {
    id: 'evt-001',
    slug: 'fintech-innovation-summit-2026',
    title: 'Fintech Innovation Summit 2026',
    description: 'The premier fintech conference in the MENA region, bringing together industry leaders, investors, and innovators to shape the future of financial technology.',
    content: '<h2>About the Summit</h2><p>The Fintech Innovation Summit 2026 is Kappar\'s flagship annual conference, gathering over 500 professionals from across the financial technology ecosystem.</p>',
    date: '2026-04-15',
    startTime: '09:00',
    endTime: '18:00',
    location: 'DIFC Conference Centre, Dubai',
    address: 'Dubai International Financial Centre, Gate Village, Dubai, UAE',
    type: 'conference',
    category: 'Tech',
    tags: ['Fintech', 'AI', 'Blockchain', 'MENA', 'Innovation'],
    featured: true,
    speakers: [
      { name: 'Sarah Chen', title: 'Managing Director', company: 'Horizon Ventures' },
      { name: 'Ahmed Al-Rashid', title: 'Chief Innovation Officer', company: 'Emirates NBD' },
      { name: 'Dr. Fatima Hassan', title: 'Head of Digital Finance', company: 'DFSA' },
    ],
    capacity: 500,
    registeredCount: 347,
    price: 299,
    currency: 'USD',
    status: 'upcoming',
  },
  {
    id: 'evt-002',
    slug: 'ai-business-executive-workshop',
    title: 'AI in Business: Executive Workshop',
    description: 'A hands-on half-day workshop designed for business leaders who want to understand and leverage AI tools for competitive advantage.',
    content: '<h2>Workshop Overview</h2><p>In this intensive half-day session, you\'ll move beyond AI hype and get practical.</p>',
    date: '2026-03-20',
    startTime: '10:00',
    endTime: '14:00',
    location: 'Online',
    type: 'workshop',
    category: 'Business',
    tags: ['AI', 'Leadership', 'Strategy', 'Digital Transformation'],
    featured: true,
    speakers: [
      { name: 'Mohammed Al-Rashid', title: 'CTO', company: 'Dubai Finance Lab' },
      { name: 'Lisa Park', title: 'AI Strategy Lead', company: 'McKinsey & Company' },
    ],
    capacity: 30,
    registeredCount: 24,
    price: 149,
    currency: 'USD',
    status: 'upcoming',
  },
];

// ========================
// DB row → KapparEvent mapper
// ========================
type DbEvent = typeof eventsTable.$inferSelect;

function mapDbToEvent(row: DbEvent): KapparEvent {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content || '',
    date: row.date,
    startTime: row.startTime || '09:00',
    endTime: row.endTime || '18:00',
    location: row.location || 'TBD',
    address: row.address || undefined,
    type: (row.type as KapparEvent['type']) || 'conference',
    category: row.category || 'General',
    tags: (row.tags as string[]) || [],
    featured: row.featured,
    coverImage: row.featuredImage || undefined,
    speakers: (row.speakers as EventSpeaker[]) || [],
    capacity: row.capacity || undefined,
    registeredCount: row.registeredCount || 0,
    price: row.price,
    currency: row.currency,
    // Use eventStatus (temporal) for the public-facing status field
    status: (row.eventStatus as KapparEvent['status']) || 'upcoming',
  };
}

// ========================
// Sort helper
// ========================
function sortEvents(evts: KapparEvent[]): KapparEvent[] {
  const upcoming = evts
    .filter(e => e.status === 'upcoming' || e.status === 'ongoing' || e.status === 'sold-out')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = evts
    .filter(e => e.status === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return [...upcoming, ...past];
}

// ========================
// Public query functions (only published events)
// ========================

export async function getAllEvents(): Promise<KapparEvent[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(eventsTable)
      .where(eq(eventsTable.status, 'published'))
      .orderBy(desc(eventsTable.date));
    if (rows.length === 0) return sortEvents([...fallbackEvents]);
    return sortEvents(rows.map(mapDbToEvent));
  } catch {
    return sortEvents([...fallbackEvents]);
  }
}

export async function getEventBySlug(slug: string): Promise<KapparEvent | undefined> {
  try {
    const db = getDb();
    const rows = await db.select().from(eventsTable)
      .where(and(eq(eventsTable.slug, slug), eq(eventsTable.status, 'published')));
    if (rows.length === 0) return fallbackEvents.find(e => e.slug === slug);
    return mapDbToEvent(rows[0]);
  } catch {
    return fallbackEvents.find(e => e.slug === slug);
  }
}

export async function getUpcomingEvents(limit?: number): Promise<KapparEvent[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(eventsTable)
      .where(and(
        eq(eventsTable.status, 'published'),
        or(eq(eventsTable.eventStatus, 'upcoming'), eq(eventsTable.eventStatus, 'ongoing'))
      ))
      .orderBy(asc(eventsTable.date));
    let events = rows.length > 0 ? rows.map(mapDbToEvent) : fallbackEvents.filter(e => e.status === 'upcoming' || e.status === 'ongoing');
    return limit ? events.slice(0, limit) : events;
  } catch {
    const upcoming = fallbackEvents.filter(e => e.status === 'upcoming' || e.status === 'ongoing')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return limit ? upcoming.slice(0, limit) : upcoming;
  }
}

export async function getFeaturedEvents(): Promise<KapparEvent[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(eventsTable)
      .where(and(
        eq(eventsTable.status, 'published'),
        eq(eventsTable.featured, true),
        ne(eventsTable.eventStatus, 'past')
      ))
      .orderBy(asc(eventsTable.date));
    if (rows.length === 0) return fallbackEvents.filter(e => e.featured && e.status !== 'past');
    return rows.map(mapDbToEvent);
  } catch {
    return fallbackEvents.filter(e => e.featured && e.status !== 'past');
  }
}

export async function getPastEvents(): Promise<KapparEvent[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(eventsTable)
      .where(and(
        eq(eventsTable.status, 'published'),
        eq(eventsTable.eventStatus, 'past')
      ))
      .orderBy(desc(eventsTable.date));
    if (rows.length === 0) return fallbackEvents.filter(e => e.status === 'past');
    return rows.map(mapDbToEvent);
  } catch {
    return fallbackEvents.filter(e => e.status === 'past');
  }
}

export async function getEventsByType(type: string): Promise<KapparEvent[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(eventsTable)
      .where(and(
        eq(eventsTable.status, 'published'),
        eq(eventsTable.type, type.toLowerCase())
      ));
    if (rows.length === 0) return sortEvents(fallbackEvents.filter(e => e.type.toLowerCase() === type.toLowerCase()));
    return sortEvents(rows.map(mapDbToEvent));
  } catch {
    return sortEvents(fallbackEvents.filter(e => e.type.toLowerCase() === type.toLowerCase()));
  }
}

export function getEventTypes(): string[] {
  return ['conference', 'workshop', 'webinar', 'networking', 'panel'];
}
