import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { bookings } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { getSessionWithRole } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const db = getDb();
    const result = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

    return NextResponse.json({ bookings: result });
  } catch (error) {
    console.error('Admin bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// AD2: Update booking status
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { bookingId, status, meetingLink } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'in-progress'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (meetingLink !== undefined) updateData.meetingLink = meetingLink;

    await db.update(bookings).set(updateData).where(eq(bookings.bookingId, bookingId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
