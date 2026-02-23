import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getSessionWithRole } from '@/lib/permissions';

// TEMPORARY: Migration v3 - Create missing tables + seed data
// DELETE THIS FILE after running migration
export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    const sql = neon(process.env.DATABASE_URL!);
    const results: string[] = [];

    // === CREATE EXPERTS TABLE ===
    await sql`CREATE TABLE IF NOT EXISTS experts (
      id SERIAL PRIMARY KEY,
      expert_id VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      bio TEXT NOT NULL,
      avatar VARCHAR(500),
      expertise JSONB NOT NULL DEFAULT '[]'::jsonb,
      hourly_rate INTEGER NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      location VARCHAR(255) NOT NULL,
      languages JSONB NOT NULL DEFAULT '[]'::jsonb,
      verified BOOLEAN NOT NULL DEFAULT false,
      featured BOOLEAN NOT NULL DEFAULT false,
      rating REAL NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      total_calls INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'published',
      managed_by INTEGER,
      review_feedback TEXT,
      reviewed_at TIMESTAMP,
      reviewed_by INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    results.push('experts table created');

    // Add missing columns to experts (in case table existed without them)
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published'`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS managed_by INTEGER`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE experts ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;
    results.push('experts columns ensured');

    // === CREATE AVAILABILITY_SLOTS TABLE ===
    await sql`CREATE TABLE IF NOT EXISTS availability_slots (
      id SERIAL PRIMARY KEY,
      slot_id VARCHAR(100) NOT NULL UNIQUE,
      expert_id VARCHAR(50) NOT NULL,
      date VARCHAR(50) NOT NULL,
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10) NOT NULL,
      booked BOOLEAN NOT NULL DEFAULT false,
      booking_id VARCHAR(100),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    results.push('availability_slots table created');

    // === CREATE EVENTS TABLE ===
    await sql`CREATE TABLE IF NOT EXISTS events (
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
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      featured BOOLEAN NOT NULL DEFAULT false,
      speakers JSONB NOT NULL DEFAULT '[]'::jsonb,
      capacity INTEGER,
      registered_count INTEGER NOT NULL DEFAULT 0,
      price INTEGER NOT NULL DEFAULT 0,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      event_status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
      status VARCHAR(50) NOT NULL DEFAULT 'published',
      review_feedback TEXT,
      reviewed_at TIMESTAMP,
      reviewed_by INTEGER,
      featured_image VARCHAR(500),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    results.push('events table created');

    // Add missing columns to events (in case table existed without them)
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS event_status VARCHAR(50) NOT NULL DEFAULT 'upcoming'`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published'`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500)`;
    results.push('events columns ensured');

    // === CREATE PARTNERS TABLE ===
    await sql`CREATE TABLE IF NOT EXISTS partners (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      industry VARCHAR(255) NOT NULL,
      services JSONB NOT NULL DEFAULT '[]'::jsonb,
      website VARCHAR(500),
      founded VARCHAR(10),
      headquarters VARCHAR(255),
      employees VARCHAR(50),
      partnership_type VARCHAR(50) NOT NULL DEFAULT 'strategic',
      partner_since VARCHAR(10),
      featured BOOLEAN NOT NULL DEFAULT false,
      collaboration_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
      key_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
      social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
      logo_url VARCHAR(500),
      status VARCHAR(50) NOT NULL DEFAULT 'published',
      review_feedback TEXT,
      reviewed_at TIMESTAMP,
      reviewed_by INTEGER,
      managed_by INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    results.push('partners table created');

    // Add missing columns to partners (in case table existed without them)
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'published'`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS review_feedback TEXT`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS reviewed_by INTEGER`;
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS managed_by INTEGER`;
    results.push('partners columns ensured');

    // === CREATE CONTACT_SUBMISSIONS TABLE ===
    await sql`CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'new',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    results.push('contact_submissions table created');

    // === CREATE NEWSLETTER_SUBSCRIBERS TABLE ===
    await sql`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      source VARCHAR(100) NOT NULL DEFAULT 'website',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    results.push('newsletter_subscribers table created');

    // === SEED EXPERTS ===
    const expertCount = await sql`SELECT COUNT(*) as count FROM experts`;
    if (Number(expertCount[0].count) === 0) {
      await sql`INSERT INTO experts (expert_id, name, title, company, bio, expertise, hourly_rate, currency, location, languages, verified, featured, rating, review_count, total_calls, status)
        VALUES
        ('exp-001', 'Sarah Chen', 'Managing Director', 'Horizon Ventures',
         'Sarah has 15 years of experience in fintech investing across Southeast Asia and the Middle East.',
         '["Venture Capital", "Fintech", "MENA Markets", "Startup Scaling"]'::jsonb,
         500, 'USD', 'Dubai, UAE', '["English", "Mandarin"]'::jsonb,
         true, true, 4.9, 47, 128, 'published'),
        ('exp-002', 'Mohammed Al-Rashid', 'Chief Technology Officer', 'Dubai Finance Lab',
         'Mohammed leads digital transformation initiatives for major financial institutions.',
         '["Islamic Finance", "RegTech", "Digital Banking", "Compliance"]'::jsonb,
         400, 'USD', 'Dubai, UAE', '["English", "Arabic"]'::jsonb,
         true, true, 4.8, 32, 89, 'published')`;
      results.push('experts seeded (2 rows)');
    } else {
      results.push('experts already has data, skipping seed');
    }

    // === SEED EVENTS ===
    const eventCount = await sql`SELECT COUNT(*) as count FROM events`;
    if (Number(eventCount[0].count) === 0) {
      await sql`INSERT INTO events (slug, title, description, content, date, start_time, end_time, location, address, type, category, tags, featured, speakers, capacity, registered_count, price, currency, event_status, status)
        VALUES
        ('fintech-innovation-summit-2026', 'Fintech Innovation Summit 2026',
         'The premier fintech conference in the MENA region, bringing together industry leaders, investors, and innovators to shape the future of financial technology.',
         '<h2>About the Summit</h2><p>The Fintech Innovation Summit 2026 is Kappar''s flagship annual conference, gathering over 500 professionals from across the financial technology ecosystem.</p>',
         '2026-04-15', '09:00', '18:00', 'DIFC Conference Centre, Dubai', 'Dubai International Financial Centre, Gate Village, Dubai, UAE',
         'conference', 'Tech', '["Fintech", "AI", "Blockchain", "MENA", "Innovation"]'::jsonb, true,
         '[{"name":"Sarah Chen","title":"Managing Director","company":"Horizon Ventures"},{"name":"Ahmed Al-Rashid","title":"Chief Innovation Officer","company":"Emirates NBD"},{"name":"Dr. Fatima Hassan","title":"Head of Digital Finance","company":"DFSA"}]'::jsonb,
         500, 347, 299, 'USD', 'upcoming', 'published'),
        ('ai-business-executive-workshop', 'AI in Business: Executive Workshop',
         'A hands-on half-day workshop designed for business leaders who want to understand and leverage AI tools for competitive advantage.',
         '<h2>Workshop Overview</h2><p>In this intensive half-day session, you''ll move beyond AI hype and get practical.</p>',
         '2026-03-20', '10:00', '14:00', 'Online', NULL,
         'workshop', 'Business', '["AI", "Leadership", "Strategy", "Digital Transformation"]'::jsonb, true,
         '[{"name":"Mohammed Al-Rashid","title":"CTO","company":"Dubai Finance Lab"},{"name":"Lisa Park","title":"AI Strategy Lead","company":"McKinsey & Company"}]'::jsonb,
         30, 24, 149, 'USD', 'upcoming', 'published')`;
      results.push('events seeded (2 rows)');
    } else {
      results.push('events already has data, skipping seed');
    }

    // === SEED PARTNERS ===
    const partnerCount = await sql`SELECT COUNT(*) as count FROM partners`;
    if (Number(partnerCount[0].count) === 0) {
      await sql`INSERT INTO partners (slug, name, description, long_description, industry, services, website, founded, headquarters, employees, partnership_type, partner_since, featured, collaboration_areas, key_highlights, social_links, status)
        VALUES
        ('gulf-capital-advisors', 'Gulf Capital Advisors',
         'Leading investment advisory firm specializing in MENA markets, private equity, and cross-border M&A transactions.',
         '<p>Gulf Capital Advisors is a premier investment advisory firm headquartered in Dubai.</p>',
         'Financial Services',
         '["Private Equity Advisory", "M&A Advisory", "Capital Markets", "Family Office Services"]'::jsonb,
         'https://gulfcapitaladvisors.ae', '2009', 'Dubai, UAE', '120+', 'strategic', '2024', true,
         '["Joint Research Reports", "Co-hosted Events", "Exclusive Content Series"]'::jsonb,
         '["$2.5B+ Assets Under Advisory", "45+ Completed Transactions", "Presence in 6 GCC Markets"]'::jsonb,
         '{"linkedin":"https://linkedin.com/company/gulf-capital-advisors","twitter":"https://twitter.com/gulfcapadvisors"}'::jsonb,
         'published'),
        ('nexatech-solutions', 'NexaTech Solutions',
         'Enterprise technology partner delivering AI-powered business intelligence and digital transformation solutions across the region.',
         '<p>NexaTech Solutions is a regional technology leader providing cutting-edge AI and machine learning solutions.</p>',
         'Technology',
         '["AI & Machine Learning", "Business Intelligence", "Cloud Infrastructure", "Digital Transformation"]'::jsonb,
         'https://nexatech.ae', '2017', 'Abu Dhabi, UAE', '300+', 'technology', '2024', true,
         '["Platform Technology", "AI Content Engine", "Joint Tech Workshops"]'::jsonb,
         '["500+ Enterprise Clients", "AWS Advanced Partner", "Regional AI Innovation Award 2025"]'::jsonb,
         '{"linkedin":"https://linkedin.com/company/nexatech-solutions","twitter":"https://twitter.com/nexatechae"}'::jsonb,
         'published')`;
      results.push('partners seeded (2 rows)');
    } else {
      results.push('partners already has data, skipping seed');
    }

    return NextResponse.json({
      success: true,
      message: 'Migration v3 complete',
      details: results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Migration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
