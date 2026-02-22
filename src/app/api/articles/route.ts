import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { articles } from '@/lib/schema';
import { getSessionWithRole } from '@/lib/permissions';
import { eq, desc } from 'drizzle-orm';

// GET all articles (admin sees all, writer sees own)
export async function GET() {
  try {
    const session = await getSessionWithRole();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    let result;

    if (session.user.role === 'admin') {
      result = await db.select().from(articles).orderBy(desc(articles.createdAt));
    } else if (session.user.role === 'writer') {
      result = await db.select().from(articles)
        .where(eq(articles.authorId, parseInt(session.user.id)))
        .orderBy(desc(articles.createdAt));
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ articles: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch articles';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create new article
export async function POST(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'writer')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, category, tags, featuredImage, readingTime, status } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields: title, excerpt, content, category' }, { status: 400 });
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 200);

    const db = getDb();
    const result = await db.insert(articles).values({
      slug,
      title: title.slice(0, 500),
      excerpt: excerpt.slice(0, 2000),
      content,
      category: category.slice(0, 100),
      tags: tags || [],
      author: session.user.name || session.user.email || 'Unknown',
      authorId: parseInt(session.user.id),
      featuredImage: featuredImage || null,
      readingTime: readingTime || Math.ceil(content.replace(/<[^>]+>/g, '').split(' ').length / 200),
      status: status === 'published' && session.user.role === 'admin' ? 'published' : 'draft',
      publishedAt: status === 'published' && session.user.role === 'admin' ? new Date() : null,
    }).returning();

    return NextResponse.json({ success: true, article: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create article';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update article
export async function PUT(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'writer')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, excerpt, content, category, tags, featuredImage, readingTime, status, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
    }

    const db = getDb();

    // Writers can only edit their own articles
    if (session.user.role === 'writer') {
      const existing = await db.select().from(articles).where(eq(articles.id, id));
      if (!existing[0] || existing[0].authorId !== parseInt(session.user.id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (title) updateData.title = title.slice(0, 500);
    if (excerpt) updateData.excerpt = excerpt.slice(0, 2000);
    if (content) updateData.content = content;
    if (category) updateData.category = category.slice(0, 100);
    if (tags) updateData.tags = tags;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (readingTime) updateData.readingTime = readingTime;

    // Only admin can publish or feature
    if (session.user.role === 'admin') {
      if (status) {
        updateData.status = status;
        if (status === 'published') updateData.publishedAt = new Date();
      }
      if (featured !== undefined) updateData.featured = featured;
    }

    // Writers can save as draft
    if (session.user.role === 'writer' && status === 'draft') {
      updateData.status = 'draft';
    }

    const result = await db.update(articles).set(updateData).where(eq(articles.id, id)).returning();

    return NextResponse.json({ success: true, article: result[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update article';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE article (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getSessionWithRole();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
    }

    const db = getDb();
    await db.delete(articles).where(eq(articles.id, id));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete article';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
