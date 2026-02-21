'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getExpertById } from '@/lib/expert-db';
import { format, parseISO } from 'date-fns';

export default function BookingPage({ params }: { params: { expertId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotId = searchParams.get('slot');
  
  const expert = getExpertById(params.expertId);
  const slot = expert?.availability.find(s => s.id === slotId);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
  });
  const [loading, setLoading] = useState(false);
  
  if (!expert || !slot) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-primary mb-4">Booking not found</h1>
          <button
            onClick={() => router.push('/experts')}
            className="text-[var(--accent-emerald)] hover:underline"
          >
            Back to Experts
          </button>        
    </div>      </div>    );
  }
  
  const duration = 60; // minutes
  const totalAmount = expert.hourlyRate;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to confirmation
    router.push(`/book/confirm?expert=${expert.id}&slot=${slot.id}`);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Complete Your Booking</h1>          
          <p className="text-secondary mt-2">Enter your details to confirm the session</p>        </div>        
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Form */}
          
          <div className="bg-card border border-primary rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-secondary mb-2">Full Name *</label>                
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                  placeholder="John Smith"
                />              
    </div>              
              
              <div>
                <label className="block text-sm text-secondary mb-2">Email *</label>                
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                  placeholder="john@company.com"
                />              
    </div>              
              
              <div>
                <label className="block text-sm text-secondary mb-2">Company</label>                
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                  placeholder="Acme Inc."
                />              
    </div>              
              
              <div>
                <label className="block text-sm text-secondary mb-2">What would you like to discuss? *</label>                
                <textarea
                  required
                  rows={4}
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)] resize-none"
                  placeholder="Brief description of what you'd like to cover..."
                />              
    </div>              
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 accent-primary text-[var(--accent-gold)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>            
    </form>          
    </div>          
          
          {/* Booking Summary */}
          
          <div className="space-y-6">
            <div className="bg-card border border-primary rounded-2xl p-6">
              <h3 className="font-display text-lg text-primary mb-4">Session Details</h3>              
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full accent-primary flex items-center justify-center">
                  <span className="text-lg text-[var(--accent-gold)] font-display">{expert.name.charAt(0)}</span>                
    </div>                
                <div>
                  <p className="text-primary font-medium">{expert.name}</p>                  
                  <p className="text-sm text-tertiary">{expert.title}</p>                
    </div>              
    </div>              
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-tertiary">Date</span>                  
                  <span className="text-primary">{format(parseISO(slot.date), 'MMMM d, yyyy')}</span>                
    </div>                
                <div className="flex justify-between">
                  <span className="text-tertiary">Time</span>                  
                  <span className="text-primary">{slot.startTime} - {slot.endTime}</span>                
    </div>                
                <div className="flex justify-between">
                  <span className="text-tertiary">Duration</span>                  
                  <span className="text-primary">{duration} minutes</span>                
    </div>                
                <div className="flex justify-between">
                  <span className="text-tertiary">Location</span>                  
                  <span className="text-primary">Video Call</span>                
    </div>              
    </div>              
              
              <div className="border-t border-primary mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Total</span>                  
                  <span className="text-2xl font-light text-primary">${totalAmount}</span>                
    </div>                
                <p className="text-xs text-tertiary mt-2">You will be charged pro-rata based on actual call duration</p>              
    </div>            
    </div>            
            
            <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)] rounded-2xl p-6">
              <h4 className="text-sm font-medium text-[var(--accent-gold)] mb-2">What's included</h4>              
              <ul className="space-y-2 text-sm text-secondary">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1-on-1 video session
                </li>                
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Recording (if agreed)
                </li>                
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Follow-up notes
                </li>                
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure payment
                </li>              
    </ul>            
    </div>          
    </div>        
    </div>      </div>    </div>  );
}
