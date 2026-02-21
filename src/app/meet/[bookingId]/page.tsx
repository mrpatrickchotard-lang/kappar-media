'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getExpertById } from '@/lib/expert-db';
import VideoRoom from '@/components/VideoRoom';

export default function MeetingPage({ params }: { params: { bookingId: string } }) {
  const searchParams = useSearchParams();
  const expertId = searchParams.get('expert');
  
  const [booking, setBooking] = useState<any>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [finalCharge, setFinalCharge] = useState(0);
  const [actualMinutes, setActualMinutes] = useState(0);
  
  const expert = expertId ? getExpertById(expertId) : null;
  
  useEffect(() => {
    // In a real app, fetch booking from API
    // For demo, create a mock booking
    setBooking({
      id: params.bookingId,
      expertId: expertId,
      clientName: 'Demo Client',
      scheduledEndTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      hourlyRate: expert?.hourlyRate || 500,
    });
  }, [params.bookingId, expertId, expert]);
  
  const handleEndCall = (minutes: number, charge: number) => {
    setActualMinutes(minutes);
    setFinalCharge(charge);
    setCallEnded(true);
  };
  
  if (!booking || !expert) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-primary mb-4">Meeting not found</h1>          
          <Link href="/experts" className="text-[var(--accent-emerald)] hover:underline">
            Browse Experts
          </Link>        
    </div>      </div>    );
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
                className="px-6 py-3 accent-primary text-[var(--accent-gold)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
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
    </div>      </div>    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-4">
          <h1 className="font-display text-2xl text-primary">Session with {expert.name}</h1>          
          <p className="text-tertiary">Booking #{booking.id}</p>        
    </div>        
        
        <VideoRoom
          bookingId={booking.id}
          expertName={expert.name}
          clientName={booking.clientName}
          scheduledEndTime={new Date(booking.scheduledEndTime)}
          hourlyRate={booking.hourlyRate}
          onEndCall={handleEndCall}
        />      
    </div>    </div>  );
}
