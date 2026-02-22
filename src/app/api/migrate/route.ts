import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// This endpoint creates the new tables and seeds data
// Protected by a secret key - call once after deploy, then remove
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Simple protection - use a secret key
    if (key !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Add new columns to users table
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS partner_id INTEGER,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true
    `;

    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(500) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags JSONB NOT NULL DEFAULT '[]',
        author VARCHAR(255) NOT NULL,
        author_id INTEGER,
        featured_image VARCHAR(500),
        reading_time INTEGER DEFAULT 5,
        featured BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        published_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Create partners table
    await sql`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        industry VARCHAR(255) NOT NULL,
        services JSONB NOT NULL DEFAULT '[]',
        website VARCHAR(500),
        founded VARCHAR(10),
        headquarters VARCHAR(255),
        employees VARCHAR(50),
        partnership_type VARCHAR(50) NOT NULL DEFAULT 'strategic',
        partner_since VARCHAR(10),
        featured BOOLEAN NOT NULL DEFAULT false,
        collaboration_areas JSONB NOT NULL DEFAULT '[]',
        key_highlights JSONB NOT NULL DEFAULT '[]',
        social_links JSONB NOT NULL DEFAULT '{}',
        logo_url VARCHAR(500),
        managed_by INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        date VARCHAR(50) NOT NULL,
        start_time VARCHAR(10),
        end_time VARCHAR(10),
        location VARCHAR(255),
        address TEXT,
        type VARCHAR(50) NOT NULL DEFAULT 'conference',
        category VARCHAR(100),
        tags JSONB NOT NULL DEFAULT '[]',
        featured BOOLEAN NOT NULL DEFAULT false,
        speakers JSONB NOT NULL DEFAULT '[]',
        capacity INTEGER,
        registered_count INTEGER NOT NULL DEFAULT 0,
        price INTEGER NOT NULL DEFAULT 0,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
        featured_image VARCHAR(500),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Migration completed. Tables created: articles, partners, events. Users table updated with new columns.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
