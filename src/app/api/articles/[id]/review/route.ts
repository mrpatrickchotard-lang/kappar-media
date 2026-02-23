import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { articles } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq } from 'drizzle-orm';

// POST: Admin approves or rejects an article
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    const body = await request.json();
    const { action, feedback } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be "approve" or "reject"' }, { status: 400 });
    }

    const db = getDb();

    // Verify article exists and is pending review
    const existing = await db.select().from(articles).where(eq(articles.id, id));
    if (!existing[0]) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (existing[0].status !== 'pending_review') {
      return NextResponse.json({ error: 'Article is not pending review' }, { status: 400 });
    }

    const now = new Date();
    const adminId = parseInt(session.user.id);

    if (action === 'approve') {
      const result = await db.update(articles).set({
        status: 'published',
        publishedAt: now,
        reviewedAt: now,
        reviewedBy: adminId,
        reviewFeedback: null,
        updatedAt: now,
      }).where(eq(articles.id, id)).returning();

      return NextResponse.json({ success: true, article: result[0], message: 'Article published' });
    }

    // action === 'reject'
    if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
      return NextResponse.json({ error: 'Feedback is required when rejecting an article' }, { status: 400 });
    }

    const result = await db.update(articles).set({
      status: 'draft',
      reviewedAt: now,
      reviewedBy: adminId,
      reviewFeedback: feedback.trim(),
      updatedAt: now,
    }).where(eq(articles.id, id)).returning();

    return NextResponse.json({ success: true, article: result[0], message: 'Article sent back to writer' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Review action failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
