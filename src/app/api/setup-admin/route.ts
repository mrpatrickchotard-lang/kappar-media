import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// One-time admin setup - protected by secret key
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const email = 'admin@kappar.tv';
    const password = 'Kappar2024!';
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length > 0) {
      // Update password
      await db.update(users).set({ passwordHash, role: 'admin' }).where(eq(users.email, email));
      return NextResponse.json({ success: true, message: 'Admin password reset', email });
    } else {
      // Create admin user
      await db.insert(users).values({
        email,
        passwordHash,
        name: 'Admin',
        role: 'admin',
      });
      return NextResponse.json({ success: true, message: 'Admin user created', email });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
