// In-memory data store for Vercel compatibility
// Replaces file-based storage with runtime memory
// For production, migrate to PostgreSQL via db-operations.ts

import { Expert, Booking, CallSession } from './experts';

// In-memory storage
let experts: Expert[] = [
  {
    id: 'exp-001',
    name: 'Sarah Chen',
    title: 'Managing Director',
    company: 'Horizon Ventures',
    bio: 'Sarah has 15 years of experience in fintech investing across Southeast Asia and the Middle East. She previously led investments at SoftBank and has portfolio companies valued at over $2B.',
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
    bio: 'Mohammed leads digital transformation initiatives for major financial institutions. He is a recognized authority on Islamic fintech and regulatory technology.',
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
  {
    id: 'exp-003',
    name: 'Elena Petrova',
    title: 'Founder & CEO',
    company: 'WealthTech Solutions',
    bio: 'Elena built and exited two wealth management platforms. She advises family offices and HNWIs on digital asset strategies and portfolio diversification.',
    expertise: ['Wealth Management', 'Digital Assets', 'Family Offices', 'Investment Strategy'],
    hourlyRate: 600,
    currency: 'USD',
    location: 'London, UK',
    languages: ['English', 'Russian', 'French'],
    availability: generateSampleAvailability('exp-003'),
    verified: true,
    featured: false,
    rating: 5.0,
    reviewCount: 23,
    totalCalls: 56,
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'exp-004',
    name: "James O'Connor",
    title: 'Partner',
    company: 'Global Payments Group',
    bio: 'James specializes in cross-border payments and remittances. He has advised central banks on CBDC strategies and worked with major payment processors.',
    expertise: ['Payments', 'CBDC', 'Remittances', 'Financial Infrastructure'],
    hourlyRate: 450,
    currency: 'USD',
    location: 'Singapore',
    languages: ['English'],
    availability: generateSampleAvailability('exp-004'),
    verified: true,
    featured: false,
    rating: 4.7,
    reviewCount: 19,
    totalCalls: 43,
    createdAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'exp-005',
    name: 'Aisha Patel',
    title: 'Head of Innovation',
    company: 'MENA Banking Consortium',
    bio: 'Aisha drives innovation strategy for a consortium of 12 regional banks. She is an expert in open banking, API ecosystems, and fintech partnerships.',
    expertise: ['Open Banking', 'APIs', 'Banking Innovation', 'Partnerships'],
    hourlyRate: 350,
    currency: 'USD',
    location: 'Abu Dhabi, UAE',
    languages: ['English', 'Hindi', 'Arabic'],
    availability: generateSampleAvailability('exp-005'),
    verified: true,
    featured: true,
    rating: 4.8,
    reviewCount: 28,
    totalCalls: 67,
    createdAt: '2026-02-10T13:00:00Z',
  },
];

let bookings: Booking[] = [];
let sessions: CallSession[] = [];

function generateSampleAvailability(expertId: string) {
  const slots = [];
  const today = new Date();
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
      slots.push({
        id: `slot-${expertId}-${dateStr}-${time.start}`,
        date: dateStr,
        startTime: time.start,
        endTime: time.end,
        booked: Math.random() > 0.7,
      });
    }
  }
  return slots;
}

export function getExperts(): Expert[] {
  return experts;
}

export function getExpertById(id: string): Expert | null {
  return experts.find(e => e.id === id) || null;
}

export function getFeaturedExperts(): Expert[] {
  return experts.filter(e => e.featured);
}

export function saveExpert(expert: Expert): void {
  const index = experts.findIndex(e => e.id === expert.id);
  if (index >= 0) {
    experts[index] = expert;
  } else {
    experts.push(expert);
  }
}

export function deleteExpert(id: string): void {
  experts = experts.filter(e => e.id !== id);
}

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

