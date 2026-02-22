import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, real } from 'drizzle-orm/pg-core';

// ============================================
// EXISTING TABLES
// ============================================

export const experts = pgTable('experts', {
  id: serial('id').primaryKey(),
  expertId: varchar('expert_id', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  bio: text('bio').notNull(),
  avatar: varchar('avatar', { length: 500 }),
  expertise: jsonb('expertise').$type<string[]>().notNull().default([]),
  hourlyRate: integer('hourly_rate').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  location: varchar('location', { length: 255 }).notNull(),
  languages: jsonb('languages').$type<string[]>().notNull().default([]),
  verified: boolean('verified').notNull().default(false),
  featured: boolean('featured').notNull().default(false),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  totalCalls: integer('total_calls').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const availabilitySlots = pgTable('availability_slots', {
  id: serial('id').primaryKey(),
  slotId: varchar('slot_id', { length: 100 }).notNull().unique(),
  expertId: varchar('expert_id', { length: 50 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  booked: boolean('booked').notNull().default(false),
  bookingId: varchar('booking_id', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingId: varchar('booking_id', { length: 100 }).notNull().unique(),
  expertId: varchar('expert_id', { length: 50 }).notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  clientCompany: varchar('client_company', { length: 255 }),
  topic: text('topic').notNull(),
  slotId: varchar('slot_id', { length: 100 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  duration: integer('duration').notNull(),
  hourlyRate: integer('hourly_rate').notNull(),
  totalAmount: integer('total_amount').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  meetingLink: varchar('meeting_link', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 100 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  source: varchar('source', { length: 100 }).notNull().default('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============================================
// UPDATED: Users table with role + partner link
// ============================================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  partnerId: integer('partner_id'),  // Links partner users to their partner record
  bio: text('bio'),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============================================
// NEW: Articles table
// ============================================

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),  // HTML from rich text editor
  category: varchar('category', { length: 100 }).notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  author: varchar('author', { length: 255 }).notNull(),
  authorId: integer('author_id'),  // FK to users table
  featuredImage: varchar('featured_image', { length: 500 }),
  readingTime: integer('reading_time').default(5),
  featured: boolean('featured').notNull().default(false),
  status: varchar('status', { length: 50 }).notNull().default('draft'),  // draft | published | archived
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// NEW: Partners table (DB-backed)
// ============================================

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  industry: varchar('industry', { length: 255 }).notNull(),
  services: jsonb('services').$type<string[]>().notNull().default([]),
  website: varchar('website', { length: 500 }),
  founded: varchar('founded', { length: 10 }),
  headquarters: varchar('headquarters', { length: 255 }),
  employees: varchar('employees', { length: 50 }),
  partnershipType: varchar('partnership_type', { length: 50 }).notNull().default('strategic'),
  partnerSince: varchar('partner_since', { length: 10 }),
  featured: boolean('featured').notNull().default(false),
  collaborationAreas: jsonb('collaboration_areas').$type<string[]>().notNull().default([]),
  keyHighlights: jsonb('key_highlights').$type<string[]>().notNull().default([]),
  socialLinks: jsonb('social_links').$type<Record<string, string>>().notNull().default({}),
  logoUrl: varchar('logo_url', { length: 500 }),
  managedBy: integer('managed_by'),  // FK to users table (partner user)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// NEW: Events table (DB-backed)
// ============================================

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  content: text('content'),  // Rich HTML content
  date: varchar('date', { length: 50 }).notNull(),
  startTime: varchar('start_time', { length: 10 }),
  endTime: varchar('end_time', { length: 10 }),
  location: varchar('location', { length: 255 }),
  address: text('address'),
  type: varchar('type', { length: 50 }).notNull().default('conference'),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  featured: boolean('featured').notNull().default(false),
  speakers: jsonb('speakers').$type<Array<{ name: string; title: string; company: string }>>().notNull().default([]),
  capacity: integer('capacity'),
  registeredCount: integer('registered_count').notNull().default(0),
  price: integer('price').notNull().default(0),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 50 }).notNull().default('upcoming'),
  featuredImage: varchar('featured_image', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
