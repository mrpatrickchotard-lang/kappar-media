import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { articles, partners as partnersTable, events as eventsTable } from '@/lib/schema';
import { getAllArticles } from '@/lib/content';
import { getAllPartners } from '@/lib/partners';
import { getAllEvents } from '@/lib/events';

// Seeds the new tables with existing in-memory data
// Protected by secret key - call once after migration
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const results = { articles: 0, partners: 0, events: 0 };

    // Seed articles
    const allArticles = await getAllArticles();
    for (const article of allArticles) {
      try {
        await db.insert(articles).values({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          tags: article.tags,
          author: article.author,
          readingTime: article.readingTime || 5,
          featured: article.featured || false,
          status: 'published',
          publishedAt: new Date(article.date),
        }).onConflictDoNothing();
        results.articles++;
      } catch {
        // Skip duplicates
      }
    }

    // Seed partners
    const allPartners = getAllPartners();
    for (const partner of allPartners) {
      try {
        await db.insert(partnersTable).values({
          slug: partner.slug,
          name: partner.name,
          description: partner.description,
          longDescription: partner.longDescription,
          industry: partner.industry,
          services: partner.services,
          website: partner.website,
          founded: partner.founded,
          headquarters: partner.headquarters,
          employees: partner.employees,
          partnershipType: partner.partnershipType,
          partnerSince: partner.partnerSince,
          featured: partner.featured,
          collaborationAreas: partner.collaborationAreas,
          keyHighlights: partner.keyHighlights,
          socialLinks: partner.socialLinks,
        }).onConflictDoNothing();
        results.partners++;
      } catch {
        // Skip duplicates
      }
    }

    // Seed events
    const allEvents = getAllEvents();
    for (const event of allEvents) {
      try {
        await db.insert(eventsTable).values({
          slug: event.slug,
          title: event.title,
          description: event.description,
          content: event.content,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          address: event.address || null,
          type: event.type,
          category: event.category,
          tags: event.tags,
          featured: event.featured || false,
          speakers: event.speakers,
          capacity: event.capacity || null,
          registeredCount: event.registeredCount || 0,
          price: event.price,
          currency: event.currency || 'USD',
          status: event.status,
        }).onConflictDoNothing();
        results.events++;
      } catch {
        // Skip duplicates
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed',
      seeded: results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
