import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { events } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { id } = await params;
    const eventId = parseInt(id, 10);
    const body = await request.json();
    const { action, feedback } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    const db = getDb();

    const current = await db.select().from(events).where(eq(events.id, eventId));
    if (current.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (current[0].status !== 'pending_review') {
      return NextResponse.json({ error: 'Event is not pending review' }, { status: 400 });
    }

    if (action === 'approve') {
      await db.update(events).set({
        status: 'published',
        reviewFeedback: null,
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.user.id as string, 10) || null,
        updatedAt: new Date(),
      }).where(eq(events.id, eventId));

      return NextResponse.json({ success: true, message: 'Event published' });
    } else {
      if (!feedback?.trim()) {
        return NextResponse.json({ error: 'Feedback required for rejection' }, { status: 400 });
      }

      await db.update(events).set({
        status: 'draft',
        reviewFeedback: feedback.trim(),
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.user.id as string, 10) || null,
        updatedAt: new Date(),
      }).where(eq(events.id, eventId));

      return NextResponse.json({ success: true, message: 'Event sent back with feedback' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Review failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
