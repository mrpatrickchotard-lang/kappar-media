import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email.toLowerCase()));

    if (existing.length > 0) {
      // If unsubscribed, re-subscribe
      if (existing[0].status === 'unsubscribed') {
        await db
          .update(newsletterSubscribers)
          .set({ status: 'active', source })
          .where(eq(newsletterSubscribers.email, email.toLowerCase()));
        return NextResponse.json({ success: true, resubscribed: true });
      }
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    // Store new subscriber
    await db.insert(newsletterSubscribers).values({
      email: email.toLowerCase(),
      source,
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
