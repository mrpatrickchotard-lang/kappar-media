import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// TEMPORARY: Migration v3 - Add review workflow to events, experts, partners
// DELETE THIS FILE after running migration
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // === EXPERTS ===
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published'`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS managed_by INTEGER`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;

    // === PARTNERS ===
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published'`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;

    // === EVENTS ===
    // Add new event_status column for temporal state
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS event_status VARCHAR(50) NOT NULL DEFAULT 'upcoming'`;
    // Copy existing status values to event_status before repurposing
    await sql`UPDATE events SET event_status = status WHERE event_status = 'upcoming' AND status IN ('upcoming', 'ongoing', 'past', 'sold-out')`;
    // Now repurpose status for review workflow (set all existing to published)
    await sql`UPDATE events SET status = 'published' WHERE status IN ('upcoming', 'ongoing', 'past', 'sold-out')`;
    // Add review fields
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;

    return NextResponse.json({
      success: true,
      message: 'Migration v3 complete: added review workflow fields to experts, partners, events',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Migration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
