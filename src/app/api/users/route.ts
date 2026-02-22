import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { createUser } from '@/lib/db-operations';
import { eq, desc } from 'drizzle-orm';

// GET all users (admin only)
export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const db = getDb();
    const result = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      partnerId: users.partnerId,
      active: users.active,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt));

    return NextResponse.json({ users: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create user (admin only)
export async function POST(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role, partnerId } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'email, password, name required' }, { status: 400 });
    }

    const validRoles = ['admin', 'writer', 'partner'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be: ${validRoles.join(', ')}` }, { status: 400 });
    }

    // Use existing createUser function which handles password hashing
    const userResult = await createUser(email, password, name);
    const user = userResult[0];

    // Update role and partnerId if specified
    if (user && role && role !== 'admin') {
      const db = getDb();
      await db.update(users).set({
        role,
        partnerId: role === 'partner' ? partnerId : null,
      }).where(eq(users.id, user.id));
    }

    return NextResponse.json({
      success: true,
      user: user ? { id: user.id, email: user.email, name: user.name, role: role || 'admin' } : null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update user (admin only)
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, role, partnerId, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (partnerId !== undefined) updateData.partnerId = partnerId;
    if (active !== undefined) updateData.active = active;

    const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      partnerId: users.partnerId,
      active: users.active,
    });

    return NextResponse.json({ success: true, user: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
