import { createPaymentIntent } from '@/lib/stripe';
import { createBooking, bookSlot, updateBooking } from '@/lib/db-operations';
import { NextResponse } from 'next/server';

const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MAX_COMPANY_LENGTH = 255;
const MAX_TOPIC_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}

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
      return NextResponse.json(
        { error: 'Expert ID and Slot ID are required' },
        { status: 400 }
      );
    }
    if (typeof clientName !== 'string' || typeof clientEmail !== 'string') {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    if (typeof hourlyRate !== 'number' || hourlyRate <= 0 || hourlyRate > 10000) {
      return NextResponse.json(
        { error: 'Invalid hourly rate' },
        { status: 400 }
      );
    }
    if (typeof date !== 'string' || typeof startTime !== 'string' || typeof endTime !== 'string') {
      return NextResponse.json(
        { error: 'Date and time are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const name = sanitize(clientName);
    const email = clientEmail.trim().toLowerCase();
    const company = typeof clientCompany === 'string' ? sanitize(clientCompany) : '';
    const topicText = typeof topic === 'string' ? sanitize(topic) : '';

    // Required field validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Length validation
    if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Name or email too long' },
        { status: 400 }
      );
    }
    if (company.length > MAX_COMPANY_LENGTH) {
      return NextResponse.json(
        { error: 'Company name too long' },
        { status: 400 }
      );
    }
    if (topicText.length > MAX_TOPIC_LENGTH) {
      return NextResponse.json(
        { error: 'Topic too long' },
        { status: 400 }
      );
    }

    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!dateRegex.test(date) || !timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    // Create booking record
    const booking = await createBooking({
      expertId,
      clientName: name,
      clientEmail: email,
      clientCompany: company,
      topic: topicText,
      slotId,
      date,
      startTime,
      endTime,
      duration: 60,
      hourlyRate,
      totalAmount: hourlyRate,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Reserve the slot first to prevent double-booking
    await bookSlot(slotId, booking.bookingId);

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(
      hourlyRate,
      'usd',
      {
        bookingId: booking.bookingId,
        expertId,
        clientEmail: email,
      }
    );

    // Update booking with payment intent ID
    await updateBooking(booking.bookingId, {
      stripePaymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({
      bookingId: booking.bookingId,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
