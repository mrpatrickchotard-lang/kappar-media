import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { experts } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq, desc } from 'drizzle-orm';

// GET experts (admin sees all with all statuses, public sees published only)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const publicMode = url.searchParams.get('public') === 'true';

    const db = getDb();

    if (publicMode) {
      // Public: only published experts
      const result = await db.select().from(experts)
        .where(eq(experts.status, 'published'))
        .orderBy(desc(experts.featured), experts.name);
      return NextResponse.json({ experts: result });
    }

    // Admin: need auth
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db.select().from(experts).orderBy(desc(experts.createdAt));
    return NextResponse.json({ experts: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch experts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create expert (admin only)
export async function POST(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { name, title, company, bio } = body;

    if (!name || !title || !company || !bio) {
      return NextResponse.json({ error: 'name, title, company, bio required' }, { status: 400 });
    }

    const expertId = `exp-${Date.now()}`;

    const db = getDb();
    const result = await db.insert(experts).values({
      expertId,
      name,
      title,
      company,
      bio,
      expertise: body.expertise || [],
      hourlyRate: body.hourlyRate || 0,
      currency: body.currency || 'USD',
      location: body.location || '',
      languages: body.languages || [],
      verified: body.verified || false,
      featured: body.featured || false,
      status: body.status || 'draft',
      managedBy: body.managedBy || null,
    }).returning();

    return NextResponse.json({ success: true, expert: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create expert';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update expert (admin only)
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expert ID required' }, { status: 400 });
    }

    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    const allowedFields = ['name', 'title', 'company', 'bio', 'expertise', 'hourlyRate', 'currency',
      'location', 'languages', 'verified', 'featured', 'status', 'managedBy', 'avatar'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    const result = await db.update(experts).set(updateData).where(eq(experts.id, id)).returning();

    return NextResponse.json({ success: true, expert: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update expert';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
