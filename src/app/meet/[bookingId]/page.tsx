'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VideoRoom from '@/components/VideoRoom';

interface BookingData {
  bookingId: string;
  expertId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  hourlyRate: number;
  totalAmount: number;
  status: string;
  meetingLink: string | null;
  topic: string;
  createdAt: string;
}

interface ExpertInfo {
  id: string;
  name: string;
  title: string;
  hourlyRate: number;
}

export default function MeetingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [expert, setExpert] = useState<ExpertInfo | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [finalCharge, setFinalCharge] = useState(0);
  const [actualMinutes, setActualMinutes] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setPageLoading(false);
      return;
    }

    // Load booking from DB
    fetch(`/api/bookings?id=${encodeURIComponent(bookingId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Booking not found');
        return res.json();
      })
      .then(data => {
        if (!data.booking) throw new Error('Booking not found');
        setBooking(data.booking);

        // Load expert info
        return fetch(`/api/experts-manage?public=true`)
          .then(res => res.ok ? res.json() : { experts: [] })
          .then(expertData => {
            const experts = expertData.experts || [];
            const found = experts.find(
              (e: ExpertInfo & { expertId?: string }) =>
                e.id === data.booking.expertId || e.expertId === data.booking.expertId
            );
            if (found) {
              setExpert(found);
            } else {
              // Fallback: use booking data for display
              setExpert({
                id: data.booking.expertId,
                name: 'Expert',
                title: 'Consultant',
                hourlyRate: data.booking.hourlyRate,
              });
            }
          });
      })
      .catch(err => {
        console.error('Failed to load meeting:', err);
        setError(err.message || 'Failed to load meeting');
      })
      .finally(() => setPageLoading(false));
  }, [bookingId]);

  const handleEndCall = async (minutes: number, charge: number) => {
    setActualMinutes(minutes);
    setFinalCharge(charge);
    setCallEnded(true);

    // Update booking in DB with actual duration and charge
    try {
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          status: 'completed',
          actualDuration: minutes,
          actualCharge: Math.round(charge * 100) / 100,
        }),
      });
    } catch (err) {
      console.error('Failed to update booking after call:', err);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }}
          />
          <p className="text-secondary text-sm">Loading your meeting...</p>
        </div>
      </div>
    );
  }

  if (error || !booking || !expert) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-primary mb-2">Meeting Not Found</h1>
          <p className="text-secondary mb-6">
            {error || 'This meeting link may have expired or the booking doesn\'t exist.'}
          </p>
          <Link
            href="/experts"
            className="inline-block px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }}
          >
            Book a New Session
          </Link>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-card border border-primary rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--accent-emerald)]/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-display text-3xl font-light text-primary mb-4">Session Complete</h1>
            <p className="text-secondary mb-8">Thank you for using Kappar Meet the Expert</p>

            <div className="bg-primary rounded-xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-tertiary uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-2xl font-light text-primary">{actualMinutes} min</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary uppercase tracking-wider mb-1">Rate</p>
                  <p className="text-2xl font-light text-primary">${booking.hourlyRate}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary uppercase tracking-wider mb-1">Charged</p>
                  <p className="text-2xl font-light text-[var(--accent-gold)]">${finalCharge.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/experts"
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#f5f3ef' }}
              >
                Book Another
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-primary text-secondary rounded-lg hover:border-secondary transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate scheduled end time from booking date + endTime
  const scheduledEnd = new Date(`${booking.date}T${booking.endTime}:00`);
  // If the scheduled time is in the past (demo purposes), set 1hr from now
  const scheduledEndTime = scheduledEnd > new Date()
    ? scheduledEnd
    : new Date(Date.now() + 60 * 60 * 1000);

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Meeting Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-primary">Session with {expert.name}</h1>
            <p className="text-tertiary text-sm mt-1">
              {booking.date} &bull; {booking.startTime} &ndash; {booking.endTime} &bull; Booking #{booking.bookingId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-emerald)]/20 text-[var(--accent-emerald)]">
              {booking.status === 'confirmed' ? 'Ready' : booking.status}
            </span>
          </div>
        </div>

        {/* Topic Banner */}
        {booking.topic && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30">
            <p className="text-sm text-secondary">
              <span className="text-[var(--accent-gold)] font-medium">Topic:</span> {booking.topic}
            </p>
          </div>
        )}

        <VideoRoom
          bookingId={booking.bookingId}
          expertName={expert.name}
          clientName={booking.clientName}
          scheduledEndTime={scheduledEndTime}
          hourlyRate={booking.hourlyRate}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
}
