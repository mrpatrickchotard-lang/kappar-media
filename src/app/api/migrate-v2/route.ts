import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// TEMPORARY: Migration endpoint for adding video, illustrations, thumbnail, and review columns
// DELETE THIS FILE after running migration
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Add video content support
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) NOT NULL DEFAULT 'text'`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS video_url VARCHAR(500)`;

    // Add illustrations gallery
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS illustrations JSONB NOT NULL DEFAULT '[]'`;

    // Add custom thumbnail
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(500)`;

    // Add admin review workflow
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;

    return NextResponse.json({
      success: true,
      message: 'Migration v2 complete: added content_type, video_url, illustrations, thumbnail, review_feedback, reviewed_at, reviewed_by columns',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Migration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
