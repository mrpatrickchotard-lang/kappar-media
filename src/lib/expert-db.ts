import { Expert, Booking, CallSession } from './experts';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const expertsFile = path.join(dataDir, 'experts.json');
const bookingsFile = path.join(dataDir, 'bookings.json');
const sessionsFile = path.join(dataDir, 'sessions.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize with sample data if empty
function initExperts(): Expert[] {
  if (fs.existsSync(expertsFile)) {
    return JSON.parse(fs.readFileSync(expertsFile, 'utf8'));
  }
  
  const sampleExperts: Expert[] = [
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
      availability: generateSampleAvailability(),
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
      availability: generateSampleAvailability(),
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
      availability: generateSampleAvailability(),
      verified: true,
      featured: false,
      rating: 5.0,
      reviewCount: 23,
      totalCalls: 56,
      createdAt: '2026-02-01T09:00:00Z',
    },
    {
      id: 'exp-004',
      name: 'James O\'Connor',
      title: 'Partner',
      company: 'Global Payments Group',
      bio: 'James specializes in cross-border payments and remittances. He has advised central banks on CBDC strategies and worked with major payment processors.',
      expertise: ['Payments', 'CBDC', 'Remittances', 'Financial Infrastructure'],
      hourlyRate: 450,
      currency: 'USD',
      location: 'Singapore',
      languages: ['English'],
      availability: generateSampleAvailability(),
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
      availability: generateSampleAvailability(),
      verified: true,
      featured: true,
      rating: 4.8,
      reviewCount: 28,
      totalCalls: 67,
      createdAt: '2026-02-10T13:00:00Z',
    },
  ];
  
  fs.writeFileSync(expertsFile, JSON.stringify(sampleExperts, null, 2));
  return sampleExperts;
}

function generateSampleAvailability() {
  const slots = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Morning slots
    slots.push({
      id: `slot-${dateStr}-09`,
      date: dateStr,
      startTime: '09:00',
      endTime: '10:00',
      booked: Math.random() > 0.7,
    });
    slots.push({
      id: `slot-${dateStr}-10`,
      date: dateStr,
      startTime: '10:00',
      endTime: '11:00',
      booked: Math.random() > 0.7,
    });
    
    // Afternoon slots
    slots.push({
      id: `slot-${dateStr}-14`,
      date: dateStr,
      startTime: '14:00',
      endTime: '15:00',
      booked: Math.random() > 0.7,
    });
    slots.push({
      id: `slot-${dateStr}-15`,
      date: dateStr,
      startTime: '15:00',
      endTime: '16:00',
      booked: Math.random() > 0.7,
    });
  }
  
  return slots;
}

export function getExperts(): Expert[] {
  return initExperts();
}

export function getExpertById(id: string): Expert | null {
  const experts = getExperts();
  return experts.find(e => e.id === id) || null;
}

export function getFeaturedExperts(): Expert[] {
  return getExperts().filter(e => e.featured);
}

export function saveExpert(expert: Expert): void {
  const experts = getExperts();
  const index = experts.findIndex(e => e.id === expert.id);
  
  if (index >= 0) {
    experts[index] = expert;
  } else {
    experts.push(expert);
  }
  
  fs.writeFileSync(expertsFile, JSON.stringify(experts, null, 2));
}

export function deleteExpert(id: string): void {
  const experts = getExperts().filter(e => e.id !== id);
  fs.writeFileSync(expertsFile, JSON.stringify(experts, null, 2));
}

// Bookings
export function getBookings(): Booking[] {
  if (!fs.existsSync(bookingsFile)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
}

export function getBookingById(id: string): Booking | null {
  const bookings = getBookings();
  return bookings.find(b => b.id === id) || null;
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  
  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.push(booking);
  }
  
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

// Sessions
export function getSessions(): CallSession[] {
  if (!fs.existsSync(sessionsFile)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
}

export function saveSession(session: CallSession): void {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.bookingId === session.bookingId);
  
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
}
