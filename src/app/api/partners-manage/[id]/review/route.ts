import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { partners } from '@/lib/schema';
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
    const partnerId = parseInt(id, 10);
    if (isNaN(partnerId) || partnerId <= 0) {
      return NextResponse.json({ error: 'Invalid partner ID' }, { status: 400 });
    }
    const body = await request.json();
    const { action, feedback } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    const db = getDb();

    const current = await db.select().from(partners).where(eq(partners.id, partnerId));
    if (current.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    if (current[0].status !== 'pending_review') {
      return NextResponse.json({ error: 'Partner is not pending review' }, { status: 400 });
    }

    if (action === 'approve') {
      await db.update(partners).set({
        status: 'published',
        reviewFeedback: null,
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.user.id as string, 10) || null,
        updatedAt: new Date(),
      }).where(eq(partners.id, partnerId));

      return NextResponse.json({ success: true, message: 'Partner published' });
    } else {
      if (!feedback?.trim()) {
        return NextResponse.json({ error: 'Feedback required for rejection' }, { status: 400 });
      }

      await db.update(partners).set({
        status: 'draft',
        reviewFeedback: feedback.trim(),
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.user.id as string, 10) || null,
        updatedAt: new Date(),
      }).where(eq(partners.id, partnerId));

      return NextResponse.json({ success: true, message: 'Partner sent back with feedback' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Review failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
