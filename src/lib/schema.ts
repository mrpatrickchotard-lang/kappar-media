import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, real } from 'drizzle-orm/pg-core';

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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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
