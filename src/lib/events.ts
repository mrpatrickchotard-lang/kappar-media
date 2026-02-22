// In-memory events store for Vercel compatibility
// Follows the same pattern as content.ts for articles

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

const events: KapparEvent[] = [
  {
    id: 'evt-001',
    slug: 'fintech-innovation-summit-2026',
    title: 'Fintech Innovation Summit 2026',
    description: 'The premier fintech conference in the MENA region, bringing together industry leaders, investors, and innovators to shape the future of financial technology.',
    content: '<h2>About the Summit</h2><p>The Fintech Innovation Summit 2026 is Kappar\'s flagship annual conference, gathering over 500 professionals from across the financial technology ecosystem. This year\'s theme focuses on the convergence of AI, blockchain, and traditional finance in the MENA region.</p><h3>What to Expect</h3><p>Over two days, attendees will experience keynote presentations from industry pioneers, hands-on workshops, live product demos, and unparalleled networking opportunities. From open banking to digital assets, every major trend will be covered.</p><h3>Who Should Attend</h3><p>This event is designed for C-suite executives, fintech founders, investors, regulators, and technology professionals who are shaping the future of finance in the Middle East and beyond.</p>',
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
    content: '<h2>Workshop Overview</h2><p>In this intensive half-day session, you\'ll move beyond AI hype and get practical. Learn how leading companies in the Gulf region are deploying AI to cut costs, accelerate growth, and create new revenue streams.</p><h3>What You\'ll Learn</h3><p>From prompt engineering to building AI-powered workflows, this workshop covers the essential skills every executive needs. You\'ll leave with a personalized AI implementation roadmap for your organization.</p><h3>Format</h3><p>Interactive workshop with live demonstrations, group exercises, and one-on-one guidance. Limited to 30 participants to ensure personalized attention.</p>',
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
  {
    id: 'evt-003',
    slug: 'mena-marketing-masterclass',
    title: 'MENA Marketing Masterclass',
    description: 'Learn proven marketing strategies tailored for the Middle Eastern market. From cultural nuances to digital channels, master the art of reaching MENA audiences.',
    content: '<h2>Masterclass Details</h2><p>The MENA region has unique cultural dynamics that make generic marketing playbooks ineffective. This masterclass, led by top regional marketers, will give you the frameworks and tactics that actually work.</p><h3>Topics Covered</h3><p>We\'ll deep dive into content localization, social media strategy for GCC audiences, influencer marketing in the Arab world, Ramadan campaign planning, and building authentic brand stories that resonate with regional consumers.</p><h3>Hands-On Components</h3><p>Participants will work on real campaign briefs and receive feedback from industry veterans. You\'ll also get access to Kappar\'s exclusive MENA marketing toolkit.</p>',
    date: '2026-05-08',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Jumeirah Emirates Towers, Dubai',
    address: 'Sheikh Zayed Road, Trade Centre Area, Dubai, UAE',
    type: 'workshop',
    category: 'Marketing',
    tags: ['Marketing', 'MENA', 'Content Strategy', 'Branding'],
    featured: false,
    speakers: [
      { name: 'Aisha Patel', title: 'Head of Innovation', company: 'MENA Banking Consortium' },
      { name: 'Omar Khalil', title: 'Regional Marketing Director', company: 'Publicis Groupe' },
    ],
    capacity: 50,
    registeredCount: 18,
    price: 199,
    currency: 'USD',
    status: 'upcoming',
  },
  {
    id: 'evt-004',
    slug: 'kappar-networking-evening-march',
    title: 'Kappar Networking Evening',
    description: 'Join fellow business leaders for an evening of meaningful connections, curated conversations, and panoramic Dubai views. Complimentary for Kappar subscribers.',
    content: '<h2>About the Evening</h2><p>Kappar Networking Evenings are intimate, curated gatherings designed to foster genuine connections between business leaders, entrepreneurs, and industry experts in the MENA region.</p><h3>Format</h3><p>The evening begins with a brief fireside chat featuring a surprise guest speaker, followed by structured networking rounds and open mingling. Enjoy craft beverages and canapés while connecting with peers who share your ambitions.</p><h3>Who Attends</h3><p>Our networking evenings attract a diverse mix of C-suite executives, startup founders, investors, and senior professionals from across industries. Each event is limited to 80 guests to maintain quality interactions.</p>',
    date: '2026-03-12',
    startTime: '19:00',
    endTime: '22:00',
    location: 'CÉ LA VI Dubai',
    address: 'Address Sky View, Downtown Dubai, UAE',
    type: 'networking',
    category: 'Lifestyle',
    tags: ['Networking', 'Community', 'Dubai', 'Business Leaders'],
    featured: false,
    speakers: [],
    capacity: 80,
    registeredCount: 73,
    price: 0,
    currency: 'USD',
    status: 'upcoming',
  },
  {
    id: 'evt-005',
    slug: 'future-of-islamic-finance-panel',
    title: 'The Future of Islamic Finance: Expert Panel',
    description: 'A virtual panel discussion exploring how digital transformation is reshaping Sharia-compliant financial services across the globe.',
    content: '<h2>Panel Discussion</h2><p>Islamic finance is undergoing a digital revolution. This expert panel brings together leading voices in Sharia-compliant fintech to discuss the intersection of traditional Islamic banking principles and cutting-edge technology.</p><h3>Discussion Topics</h3><p>Panelists will explore digital sukuk issuance, blockchain-based Sharia compliance, the rise of Islamic neobanks, and how AI is being used to streamline fatwa processes for financial products.</p><h3>Interactive Q&A</h3><p>The second half of the session is dedicated to audience questions. Submit your questions in advance or ask live during the event.</p>',
    date: '2026-02-10',
    startTime: '15:00',
    endTime: '16:30',
    location: 'Online',
    type: 'panel',
    category: 'Tech',
    tags: ['Islamic Finance', 'Fintech', 'Digital Transformation', 'Sharia Compliance'],
    featured: false,
    speakers: [
      { name: 'Dr. Yusuf Ibrahim', title: 'Director of Islamic Finance', company: 'Dubai Islamic Bank' },
      { name: 'Sarah Chen', title: 'Managing Director', company: 'Horizon Ventures' },
      { name: 'Khalid Al-Mansoori', title: 'Sharia Board Member', company: 'AAOIFI' },
    ],
    capacity: 200,
    registeredCount: 200,
    price: 0,
    currency: 'USD',
    status: 'past',
  },
];

// Sort events: upcoming first (by date ASC), then past (by date DESC)
function sortEvents(evts: KapparEvent[]): KapparEvent[] {
  const upcoming = evts
    .filter(e => e.status === 'upcoming' || e.status === 'ongoing' || e.status === 'sold-out')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = evts
    .filter(e => e.status === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return [...upcoming, ...past];
}

export function getAllEvents(): KapparEvent[] {
  return sortEvents([...events]);
}

export function getEventBySlug(slug: string): KapparEvent | undefined {
  return events.find(e => e.slug === slug);
}

export function getUpcomingEvents(limit?: number): KapparEvent[] {
  const upcoming = events
    .filter(e => e.status === 'upcoming' || e.status === 'ongoing')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getFeaturedEvents(): KapparEvent[] {
  return events
    .filter(e => e.featured && e.status !== 'past')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents(): KapparEvent[] {
  return events
    .filter(e => e.status === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEventsByType(type: string): KapparEvent[] {
  return sortEvents(events.filter(e => e.type.toLowerCase() === type.toLowerCase()));
}

export function getEventTypes(): string[] {
  return ['conference', 'workshop', 'webinar', 'networking', 'panel'];
}
