import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { events } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { desc } from 'drizzle-orm';

// GET all events (admin only)
export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const result = await db.select().from(events).orderBy(desc(events.date));

    return NextResponse.json({ events: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
