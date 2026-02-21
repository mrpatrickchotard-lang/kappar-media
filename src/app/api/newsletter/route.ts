import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const MAX_EMAIL_LENGTH = 255;
const MAX_SOURCE_LENGTH = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Type validation
    if (typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email must be a string' },
        { status: 400 }
      );
    }

    if (typeof source !== 'string') {
      return NextResponse.json(
        { error: 'Source must be a string' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSource = source.trim().slice(0, MAX_SOURCE_LENGTH);

    // Required field
    if (!trimmedEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Length validation
    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email must be under ${MAX_EMAIL_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Email format validation
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, trimmedEmail));

    if (existing.length > 0) {
      if (existing[0].status === 'unsubscribed') {
        await db
          .update(newsletterSubscribers)
          .set({ status: 'active', source: trimmedSource })
          .where(eq(newsletterSubscribers.email, trimmedEmail));
        return NextResponse.json({ success: true, resubscribed: true });
      }
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    // Store new subscriber
    await db.insert(newsletterSubscribers).values({
      email: trimmedEmail,
      source: trimmedSource,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
