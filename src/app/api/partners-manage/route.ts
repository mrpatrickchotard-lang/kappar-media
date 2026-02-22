import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { partners } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq, desc } from 'drizzle-orm';

// GET partners (admin sees all, partner sees own)
export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    let result;

    if (session.user.role === 'admin') {
      result = await db.select().from(partners).orderBy(desc(partners.createdAt));
    } else if (session.user.role === 'partner' && session.user.partnerId) {
      result = await db.select().from(partners)
        .where(eq(partners.id, session.user.partnerId));
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ partners: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch partners';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update partner profile
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'partner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });
    }

    // Partners can only edit their own profile
    if (session.user.role === 'partner' && session.user.partnerId !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    // Allowed fields for partner role
    const partnerFields = ['description', 'longDescription', 'services', 'website', 'employees', 'collaborationAreas', 'keyHighlights', 'socialLinks', 'logoUrl'];
    // Admin-only fields
    const adminFields = ['name', 'industry', 'founded', 'headquarters', 'partnershipType', 'partnerSince', 'featured', 'managedBy', 'slug'];

    for (const field of partnerFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    if (session.user.role === 'admin') {
      for (const field of adminFields) {
        if (data[field] !== undefined) updateData[field] = data[field];
      }
    }

    const result = await db.update(partners).set(updateData).where(eq(partners.id, id)).returning();

    return NextResponse.json({ success: true, partner: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update partner';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create partner (admin only)
export async function POST(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, industry } = body;

    if (!name || !description || !industry) {
      return NextResponse.json({ error: 'name, description, industry required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const db = getDb();
    const result = await db.insert(partners).values({
      slug,
      name,
      description,
      longDescription: body.longDescription || '',
      industry,
      services: body.services || [],
      website: body.website || null,
      founded: body.founded || null,
      headquarters: body.headquarters || null,
      employees: body.employees || null,
      partnershipType: body.partnershipType || 'strategic',
      partnerSince: body.partnerSince || new Date().getFullYear().toString(),
      featured: body.featured || false,
      collaborationAreas: body.collaborationAreas || [],
      keyHighlights: body.keyHighlights || [],
      socialLinks: body.socialLinks || {},
      logoUrl: body.logoUrl || null,
      managedBy: body.managedBy || null,
    }).returning();

    return NextResponse.json({ success: true, partner: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create partner';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
