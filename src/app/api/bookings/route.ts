import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { bookings } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MAX_COMPANY_LENGTH = 255;
const MAX_TOPIC_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}

// GET /api/bookings?id=xxx — fetch a single booking by bookingId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Sanitize bookingId
    const cleanId = bookingId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanId || cleanId.length > 50) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const db = getDb();
    const result = await db.select().from(bookings).where(eq(bookings.bookingId, cleanId));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = result[0];

    return NextResponse.json({
      booking: {
        bookingId: booking.bookingId,
        expertId: booking.expertId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: booking.duration,
        hourlyRate: booking.hourlyRate,
        totalAmount: booking.totalAmount,
        status: booking.status,
        meetingLink: booking.meetingLink,
        topic: booking.topic,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error('Fetch booking error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// POST /api/bookings — create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      expertId, slotId, clientName, clientEmail,
      clientCompany, topic, hourlyRate,
      date, startTime, endTime,
    } = body;

    // Type validation
    if (typeof expertId !== 'string' || typeof slotId !== 'string') {
      return NextResponse.json({ error: 'Expert ID and Slot ID are required' }, { status: 400 });
    }
    if (typeof clientName !== 'string' || typeof clientEmail !== 'string') {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    if (typeof hourlyRate !== 'number' || hourlyRate <= 0 || hourlyRate > 10000) {
      return NextResponse.json({ error: 'Invalid hourly rate' }, { status: 400 });
    }
    if (typeof date !== 'string' || typeof startTime !== 'string' || typeof endTime !== 'string') {
      return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
    }

    // Sanitize inputs
    const name = sanitize(clientName);
    const email = clientEmail.trim().toLowerCase();
    const company = typeof clientCompany === 'string' ? sanitize(clientCompany) : '';
    const topicText = typeof topic === 'string' ? sanitize(topic) : '';

    // Required field validation
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Length validation
    if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ error: 'Name or email too long' }, { status: 400 });
    }
    if (company.length > MAX_COMPANY_LENGTH) {
      return NextResponse.json({ error: 'Company name too long' }, { status: 400 });
    }
    if (topicText.length > MAX_TOPIC_LENGTH) {
      return NextResponse.json({ error: 'Topic too long' }, { status: 400 });
    }

    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Date format validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!dateRegex.test(date) || !timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json({ error: 'Invalid date or time format' }, { status: 400 });
    }

    // Generate booking ID and meeting link
    const bookingId = nanoid(10);
    const meetingLink = `/meet/${bookingId}`;

    // Create booking in DB
    const db = getDb();
    const result = await db.insert(bookings).values({
      bookingId,
      expertId,
      clientName: name,
      clientEmail: email,
      clientCompany: company || null,
      topic: topicText || 'General consultation',
      slotId,
      date,
      startTime,
      endTime,
      duration: 60,
      hourlyRate,
      totalAmount: hourlyRate,
      status: 'confirmed',
      paymentStatus: 'pending',
      meetingLink,
    }).returning();

    if (!result[0]) {
      throw new Error('Failed to insert booking');
    }

    return NextResponse.json({
      bookingId: result[0].bookingId,
      meetingLink,
      status: 'confirmed',
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PUT /api/bookings — update booking status (e.g., after call ends)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, status, actualDuration, actualCharge, notes } = body;

    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (typeof actualDuration === 'number') updateData.duration = actualDuration;
    if (typeof actualCharge === 'number') updateData.totalAmount = actualCharge;
    if (typeof notes === 'string') updateData.notes = sanitize(notes);

    const db = getDb();
    await db.update(bookings).set(updateData).where(eq(bookings.bookingId, bookingId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
