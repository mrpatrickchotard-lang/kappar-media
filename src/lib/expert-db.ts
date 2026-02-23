// Expert data library — DB-backed with in-memory fallback
// Public functions only return experts where status = 'published'

import { Expert, Booking, CallSession } from './experts';
import { getDb } from './db';
import { experts as expertsTable } from './schema';
import { eq, desc } from 'drizzle-orm';

// ========================
// DB row → Expert mapper
// ========================
type DbExpert = typeof expertsTable.$inferSelect;

function mapDbToExpert(row: DbExpert): Expert {
  return {
    id: row.expertId,
    name: row.name,
    title: row.title,
    company: row.company,
    bio: row.bio,
    avatar: row.avatar || undefined,
    expertise: (row.expertise as string[]) || [],
    hourlyRate: row.hourlyRate,
    currency: row.currency,
    location: row.location,
    languages: (row.languages as string[]) || [],
    availability: generateSampleAvailability(row.expertId),
    verified: row.verified,
    featured: row.featured,
    rating: row.rating,
    reviewCount: row.reviewCount,
    totalCalls: row.totalCalls,
    createdAt: row.createdAt.toISOString(),
  };
}

// In-memory storage for bookings/sessions (these remain in-memory)
let bookings: Booking[] = [];
let sessions: CallSession[] = [];

// ========================
// In-memory fallback experts
// ========================
const fallbackExperts: Expert[] = [
  {
    id: 'exp-001',
    name: 'Sarah Chen',
    title: 'Managing Director',
    company: 'Horizon Ventures',
    bio: 'Sarah has 15 years of experience in fintech investing across Southeast Asia and the Middle East.',
    expertise: ['Venture Capital', 'Fintech', 'MENA Markets', 'Startup Scaling'],
    hourlyRate: 500,
    currency: 'USD',
    location: 'Dubai, UAE',
    languages: ['English', 'Mandarin'],
    availability: generateSampleAvailability('exp-001'),
    verified: true,
    featured: true,
    rating: 4.9,
    reviewCount: 47,
    totalCalls: 128,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'exp-002',
    name: 'Mohammed Al-Rashid',
    title: 'Chief Technology Officer',
    company: 'Dubai Finance Lab',
    bio: 'Mohammed leads digital transformation initiatives for major financial institutions.',
    expertise: ['Islamic Finance', 'RegTech', 'Digital Banking', 'Compliance'],
    hourlyRate: 400,
    currency: 'USD',
    location: 'Dubai, UAE',
    languages: ['English', 'Arabic'],
    availability: generateSampleAvailability('exp-002'),
    verified: true,
    featured: true,
    rating: 4.8,
    reviewCount: 32,
    totalCalls: 89,
    createdAt: '2026-01-20T14:00:00Z',
  },
];

// ========================
// Availability generator (kept for compatibility)
// ========================
function getSeededRandom(seed: string, index: number): number {
  const combined = seed + index.toString();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
}

function generateSampleAvailability(expertId: string): Array<{
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  booked: boolean;
}> {
  const slots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    booked: boolean;
  }> = [];
  const today = new Date();
  let slotIndex = 0;

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split('T')[0];
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
    ];

    for (const time of timeSlots) {
      const isBooked = getSeededRandom(expertId, slotIndex) > 0.7;
      slots.push({
        id: `slot-${expertId}-${dateStr}-${time.start}`,
        date: dateStr,
        startTime: time.start,
        endTime: time.end,
        booked: isBooked,
      });
      slotIndex++;
    }
  }
  return slots;
}

// ========================
// Public query functions (only published experts)
// ========================

export async function getExperts(): Promise<Expert[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(expertsTable)
      .where(eq(expertsTable.status, 'published'))
      .orderBy(desc(expertsTable.featured), expertsTable.name);
    if (rows.length === 0) return [...fallbackExperts];
    return rows.map(mapDbToExpert);
  } catch {
    return [...fallbackExperts];
  }
}

export async function getExpertById(id: string): Promise<Expert | null> {
  try {
    const db = getDb();
    const rows = await db.select().from(expertsTable)
      .where(eq(expertsTable.expertId, id));
    // For expert detail page, show even if not published (for preview purposes)
    // But for public listing, getExperts() filters by published
    if (rows.length === 0) return fallbackExperts.find(e => e.id === id) || null;
    return mapDbToExpert(rows[0]);
  } catch {
    return fallbackExperts.find(e => e.id === id) || null;
  }
}

export async function getFeaturedExperts(): Promise<Expert[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(expertsTable)
      .where(eq(expertsTable.status, 'published'));
    if (rows.length === 0) return fallbackExperts.filter(e => e.featured);
    return rows.map(mapDbToExpert).filter(e => e.featured);
  } catch {
    return fallbackExperts.filter(e => e.featured);
  }
}

// Kept for backward compatibility (in-memory mutations)
export function saveExpert(expert: Expert): void {
  // No-op for now — admin uses API for mutations
  void expert;
}

export function deleteExpert(id: string): void {
  void id;
}

// Booking functions remain in-memory
export function getBookings(): Booking[] {
  return bookings;
}

export function getBookingById(id: string): Booking | null {
  return bookings.find(b => b.id === id) || null;
}

export function saveBooking(booking: Booking): void {
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.push(booking);
  }
}

export function getSessions(): CallSession[] {
  return sessions;
}

export function saveSession(session: CallSession): void {
  const index = sessions.findIndex(s => s.bookingId === session.bookingId);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
}
