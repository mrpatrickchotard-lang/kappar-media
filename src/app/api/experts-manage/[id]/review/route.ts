import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { experts } from '@/lib/schema';
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
    const expertId = parseInt(id, 10);
    if (isNaN(expertId) || expertId <= 0) {
      return NextResponse.json({ error: 'Invalid expert ID' }, { status: 400 });
    }
    const body = await request.json();
    const { action, feedback } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    const db = getDb();

    // Check current status
    const current = await db.select().from(experts).where(eq(experts.id, expertId));
    if (current.length === 0) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    if (current[0].status !== 'pending_review') {
      return NextResponse.json({ error: 'Expert is not pending review' }, { status: 400 });
    }

    if (action === 'approve') {
      await db.update(experts).set({
        status: 'published',
        reviewFeedback: null,
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.user.id as string, 10) || null,
        updatedAt: new Date(),
      }).where(eq(experts.id, expertId));

      return NextResponse.json({ success: true, message: 'Expert published' });
    } else {
      if (!feedback?.trim()) {
        return NextResponse.json({ error: 'Feedback required for rejection' }, { status: 400 });
      }

      await db.update(experts).set({
        status: 'draft',
        reviewFeedback: feedback.trim(),
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.user.id as string, 10) || null,
        updatedAt: new Date(),
      }).where(eq(experts.id, expertId));

      return NextResponse.json({ success: true, message: 'Expert sent back with feedback' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Review failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
