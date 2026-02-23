import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { events } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq, desc } from 'drizzle-orm';

// GET all events (admin sees all statuses)
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
      eventStatus: body.eventStatus || 'upcoming',
      status: body.status || 'draft',
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
