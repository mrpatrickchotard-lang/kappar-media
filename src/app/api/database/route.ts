import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionWithRole } from '@/lib/permissions';
import { articles, partners, events, users, contactSubmissions, newsletterSubscribers, bookings, experts } from '@/lib/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { PgColumn } from 'drizzle-orm/pg-core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTableAndId(table: string): { schema: PgTable<any>; idCol: PgColumn<any> } | null {
  switch (table) {
    case 'articles': return { schema: articles, idCol: articles.id };
    case 'partners': return { schema: partners, idCol: partners.id };
    case 'events': return { schema: events, idCol: events.id };
    case 'users': return { schema: users, idCol: users.id };
    case 'contact_submissions': return { schema: contactSubmissions, idCol: contactSubmissions.id };
    case 'newsletter_subscribers': return { schema: newsletterSubscribers, idCol: newsletterSubscribers.id };
    case 'bookings': return { schema: bookings, idCol: bookings.id };
    case 'experts': return { schema: experts, idCol: experts.id };
    default: return null;
  }
}

// GET — Read table data with pagination
export async function GET(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'articles';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    const db = getDb();
    const tableInfo = getTableAndId(table);
    if (!tableInfo) {
      return NextResponse.json({ error: 'Invalid table.' }, { status: 400 });
    }

    const { schema, idCol } = tableInfo;

    // Get total count
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema);
    const total = Number(countResult[0]?.count || 0);

    // Get rows
    const rows = await db.select().from(schema)
      .orderBy(desc(idCol))
      .limit(limit)
      .offset(offset);

    // For users table, strip password hashes
    const safeRows = table === 'users'
      ? (rows as Record<string, unknown>[]).map(({ passwordHash, ...rest }) => ({ ...rest, passwordHash: '***' }))
      : rows;

    return NextResponse.json({
      table,
      rows: safeRows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database query failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT — Update a row in a table
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { table, id, data } = body;

    if (!table || !id || !data) {
      return NextResponse.json({ error: 'table, id, and data required' }, { status: 400 });
    }

    // Don't allow editing password hashes through this endpoint
    if (table === 'users' && data.passwordHash) {
      delete data.passwordHash;
    }

    const tableInfo = getTableAndId(table);
    if (!tableInfo) {
      return NextResponse.json({ error: 'Invalid table.' }, { status: 400 });
    }

    const db = getDb();
    const { schema, idCol } = tableInfo;

    // Parse JSON strings back to objects for jsonb columns
    const parsedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed) || (typeof parsed === 'object' && parsed !== null)) {
            parsedData[key] = parsed;
            continue;
          }
        } catch {
          // Not JSON, use as string
        }
      }
      parsedData[key] = value;
    }

    const result = await db.update(schema)
      .set(parsedData)
      .where(eq(idCol, id))
      .returning();

    return NextResponse.json({ success: true, row: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — Delete a row from a table
export async function DELETE(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { table, id } = body;

    if (!table || !id) {
      return NextResponse.json({ error: 'table and id required' }, { status: 400 });
    }

    const tableInfo = getTableAndId(table);
    if (!tableInfo) {
      return NextResponse.json({ error: 'Invalid table.' }, { status: 400 });
    }

    const db = getDb();
    const { schema, idCol } = tableInfo;

    await db.delete(schema).where(eq(idCol, id));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
