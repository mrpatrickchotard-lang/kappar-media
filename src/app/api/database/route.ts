import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionWithRole } from '@/lib/permissions';
import { articles, partners, events, users, contactSubmissions, newsletterSubscribers, bookings, experts } from '@/lib/schema';
import { desc, sql } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { PgColumn } from 'drizzle-orm/pg-core';

// Database explorer API — admin only
// Returns table data with pagination
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

    // Use a switch to avoid complex typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let schema: PgTable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderCol: PgColumn<any>;

    switch (table) {
      case 'articles': schema = articles; orderCol = articles.id; break;
      case 'partners': schema = partners; orderCol = partners.id; break;
      case 'events': schema = events; orderCol = events.id; break;
      case 'users': schema = users; orderCol = users.id; break;
      case 'contact_submissions': schema = contactSubmissions; orderCol = contactSubmissions.id; break;
      case 'newsletter_subscribers': schema = newsletterSubscribers; orderCol = newsletterSubscribers.id; break;
      case 'bookings': schema = bookings; orderCol = bookings.id; break;
      case 'experts': schema = experts; orderCol = experts.id; break;
      default:
        return NextResponse.json({ error: `Invalid table.` }, { status: 400 });
    }

    // Get total count
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema);
    const total = Number(countResult[0]?.count || 0);

    // Get rows
    const rows = await db.select().from(schema)
      .orderBy(desc(orderCol))
      .limit(limit)
      .offset(offset);

    // For users table, strip password hashes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
