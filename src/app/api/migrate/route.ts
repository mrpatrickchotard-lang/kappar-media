import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Temporary migration endpoint - remove after running
export async function GET(request: Request) {
  // Simple auth check
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (key !== 'kappar-migrate-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Create all tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS experts (
        id SERIAL PRIMARY KEY,
        expert_id VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        avatar VARCHAR(500),
        expertise JSONB NOT NULL DEFAULT '[]',
        hourly_rate INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        location VARCHAR(255) NOT NULL,
        languages JSONB NOT NULL DEFAULT '[]',
        verified BOOLEAN NOT NULL DEFAULT false,
        featured BOOLEAN NOT NULL DEFAULT false,
        rating REAL NOT NULL DEFAULT 0,
        review_count INTEGER NOT NULL DEFAULT 0,
        total_calls INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS availability_slots (
        id SERIAL PRIMARY KEY,
        slot_id VARCHAR(100) NOT NULL UNIQUE,
        expert_id VARCHAR(50) NOT NULL,
        date VARCHAR(50) NOT NULL,
        start_time VARCHAR(10) NOT NULL,
        end_time VARCHAR(10) NOT NULL,
        booked BOOLEAN NOT NULL DEFAULT false,
        booking_id VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(100) NOT NULL UNIQUE,
        expert_id VARCHAR(50) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_company VARCHAR(255),
        topic TEXT NOT NULL,
        slot_id VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        start_time VARCHAR(10) NOT NULL,
        end_time VARCHAR(10) NOT NULL,
        duration INTEGER NOT NULL,
        hourly_rate INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        stripe_payment_intent_id VARCHAR(255),
        meeting_link VARCHAR(500),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        source VARCHAR(100) NOT NULL DEFAULT 'website',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Verify tables exist
    const tables = await db.execute(sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    return NextResponse.json({
      success: true,
      message: 'All tables created successfully',
      tables: tables.rows,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({
      error: 'Migration failed',
      details: error.message,
    }, { status: 500 });
  }
}
