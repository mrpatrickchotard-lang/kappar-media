import { db } from './db';
import { experts, availabilitySlots, bookings, users } from './schema';
import { eq, and, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// Expert operations
export async function getExperts() {
  return db.select().from(experts).orderBy(desc(experts.featured), desc(experts.rating));
}

export async function getExpertById(expertId: string) {
  const result = await db.select().from(experts).where(eq(experts.expertId, expertId));
  return result[0] || null;
}

export async function getExpertWithAvailability(expertId: string) {
  const expert = await getExpertById(expertId);
  if (!expert) return null;
  
  const slots = await db
    .select()
    .from(availabilitySlots)
    .where(eq(availabilitySlots.expertId, expertId))
    .orderBy(availabilitySlots.date, availabilitySlots.startTime);
  
  return { ...expert, availability: slots };
}

export async function createExpert(data: typeof experts.$inferInsert) {
  return db.insert(experts).values(data).returning();
}

export async function updateExpert(expertId: string, data: Partial<typeof experts.$inferInsert>) {
  return db.update(experts).set({ ...data, updatedAt: new Date() }).where(eq(experts.expertId, expertId));
}

// Availability operations
export async function getAvailableSlots(expertId: string) {
  return db
    .select()
    .from(availabilitySlots)
    .where(and(eq(availabilitySlots.expertId, expertId), eq(availabilitySlots.booked, false)))
    .orderBy(availabilitySlots.date, availabilitySlots.startTime);
}

export async function createSlot(data: typeof availabilitySlots.$inferInsert) {
  return db.insert(availabilitySlots).values(data).returning();
}

export async function bookSlot(slotId: string, bookingId: string) {
  return db
    .update(availabilitySlots)
    .set({ booked: true, bookingId })
    .where(eq(availabilitySlots.slotId, slotId));
}

// Booking operations
export async function createBooking(data: Omit<typeof bookings.$inferInsert, 'bookingId'>) {
  const bookingId = nanoid(10);
  const result = await db.insert(bookings).values({ ...data, bookingId }).returning();
  return result[0];
}

export async function getBookingById(bookingId: string) {
  const result = await db.select().from(bookings).where(eq(bookings.bookingId, bookingId));
  return result[0] || null;
}

export async function updateBooking(bookingId: string, data: Partial<typeof bookings.$inferInsert>) {
  return db.update(bookings).set({ ...data, updatedAt: new Date() }).where(eq(bookings.bookingId, bookingId));
}

export async function getBookingsByExpert(expertId: string) {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.expertId, expertId))
    .orderBy(desc(bookings.createdAt));
}

// User operations
export async function createUser(email: string, password: string, name: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.insert(users).values({ email, passwordHash, name }).returning();
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

