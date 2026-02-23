import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { bookings } from '@/lib/schema';
import { desc } from 'drizzle-orm';
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
