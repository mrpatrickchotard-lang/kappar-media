import { createPaymentIntent } from '@/lib/stripe';
import { createBooking, bookSlot, getBookingById, updateBooking } from '@/lib/db-operations';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { expertId, slotId, clientName, clientEmail, clientCompany, topic, hourlyRate } = body;

    // Create booking record
    const booking = await createBooking({
      expertId,
      clientName,
      clientEmail,
      clientCompany,
      topic,
      slotId,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      duration: 60,
      hourlyRate,
      totalAmount: hourlyRate,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(
      hourlyRate,
      'usd',
      {
        bookingId: booking.bookingId,
        expertId,
        clientEmail,
      }
    );

    // Update booking with payment intent
    await updateBooking(booking.bookingId, {
      stripePaymentIntentId: paymentIntent.id,
    });

    // Reserve the slot
    await bookSlot(slotId, booking.bookingId);

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
