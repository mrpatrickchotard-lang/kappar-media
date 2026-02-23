import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { events } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq, desc } from 'drizzle-orm';
import { getAllEvents } from '@/lib/events';

const VALID_STATUSES = ['draft', 'pending_review', 'published', 'archived'];
const VALID_EVENT_STATUSES = ['upcoming', 'ongoing', 'past', 'sold-out'];

// GET all events (admin sees all statuses, falls back to library data if DB table missing)
export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const db = getDb();
      const result = await db.select().from(events).orderBy(desc(events.date));
      return NextResponse.json({ events: result });
    } catch {
      // DB table may not exist yet — fall back to library (published events only)
      const fallback = await getAllEvents();
      const mapped = fallback.map(e => ({
        id: Number(e.id.replace('evt-', '')) || 0,
        slug: e.slug,
        title: e.title,
        description: e.description,
        content: e.content || '',
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        address: e.address || null,
        type: e.type,
        category: e.category,
        tags: e.tags,
        featured: e.featured || false,
        speakers: e.speakers,
        capacity: e.capacity || null,
        registeredCount: e.registeredCount || 0,
        price: e.price,
        currency: e.currency,
        eventStatus: e.status,  // temporal status
        status: 'published',    // review status
        reviewFeedback: null,
        reviewedAt: null,
        reviewedBy: null,
        featuredImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      return NextResponse.json({ events: mapped });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create event (admin only)
export async function POST(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, date } = body;

    if (!title || !description || !date) {
      return NextResponse.json({ error: 'title, description, date required' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const db = getDb();
    const result = await db.insert(events).values({
      slug,
      title,
      description,
      content: body.content || '',
      date,
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      location: body.location || null,
      address: body.address || null,
      type: body.type || 'conference',
      category: body.category || null,
      tags: body.tags || [],
      featured: body.featured || false,
      speakers: body.speakers || [],
      capacity: body.capacity || null,
      registeredCount: body.registeredCount || 0,
      price: body.price || 0,
      currency: body.currency || 'USD',
      eventStatus: VALID_EVENT_STATUSES.includes(body.eventStatus) ? body.eventStatus : 'upcoming',
      status: VALID_STATUSES.includes(body.status) ? body.status : 'draft',
      featuredImage: body.featuredImage || null,
    }).returning();

    return NextResponse.json({ success: true, event: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update event (admin only)
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    const allowedFields = ['title', 'description', 'content', 'date', 'startTime', 'endTime',
      'location', 'address', 'type', 'category', 'tags', 'featured', 'speakers', 'capacity',
      'registeredCount', 'price', 'currency', 'eventStatus', 'status', 'featuredImage', 'slug'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    // Validate enum fields
    if (updateData.status && !VALID_STATUSES.includes(updateData.status as string)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    if (updateData.eventStatus && !VALID_EVENT_STATUSES.includes(updateData.eventStatus as string)) {
      return NextResponse.json({ error: 'Invalid event status value' }, { status: 400 });
    }

    const result = await db.update(events).set(updateData).where(eq(events.id, id)).returning();

    return NextResponse.json({ success: true, event: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE event (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const db = getDb();
    await db.delete(events).where(eq(events.id, parseInt(id, 10)));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
