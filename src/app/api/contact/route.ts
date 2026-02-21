import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/schema';
import { NextResponse } from 'next/server';

const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 10000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Type validation
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json(
        { error: 'All fields must be strings' },
        { status: 400 }
      );
    }

    // Required fields
    const trimmedName = sanitize(name);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = sanitize(subject);
    const trimmedMessage = sanitize(message);

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Length validation
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be under ${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email must be under ${MAX_EMAIL_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (trimmedSubject.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json(
        { error: `Subject must be under ${MAX_SUBJECT_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Email format validation
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Store in database
    const result = await db.insert(contactSubmissions).values({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    }).returning();

    return NextResponse.json({
      success: true,
      id: result[0].id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
