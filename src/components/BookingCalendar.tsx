'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO, isSameDay } from 'date-fns';

interface BookingCalendarProps {
  expert: any;
}

export default function BookingCalendar({ expert }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const router = useRouter();
  
  const availableSlots = expert.availability.filter((s: any) => !s.booked);
  
  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc: any, slot: any) => {
    const date = slot.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});
  
  const dates = Object.keys(slotsByDate).sort();
  
  const handleBooking = () => {
    if (!selectedSlot) return;
    router.push(`/book/${expert.id}?slot=${selectedSlot.id}`);
  };
  
  return (
    <div>
      <p className="text-sm text-secondary mb-4">Select a date and time</p>
      
      {/* Date Selection */}
      <div className="mb-6">
        <p className="text-xs text-tertiary uppercase tracking-wider mb-3">Available Dates</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((dateStr) => {
            const date = parseISO(dateStr);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            
            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                className={`flex-shrink-0 p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10'
                    : 'border-primary hover:border-secondary'
                }`}
              >
                <p className={`text-xs ${isSelected ? 'text-[var(--accent-emerald)]' : 'text-tertiary'}`}>
                  {format(date, 'EEE')}
                </p>
                <p className={`text-lg font-medium ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                  {format(date, 'd')}
                </p>
                <p className={`text-xs ${isSelected ? 'text-[var(--accent-emerald)]' : 'text-tertiary'}`}>
                  {format(date, 'MMM')}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Time Selection */}
      
      {selectedDate && (
        <div className="mb-6">
          <p className="text-xs text-tertiary uppercase tracking-wider mb-3">Available Times</p>
          
          <div className="grid grid-cols-2 gap-2">
            {slotsByDate[format(selectedDate, 'yyyy-MM-dd')]?.map((slot: any) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  selectedSlot?.id === slot.id
                    ? 'border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10 text-primary'
                    : 'border-primary hover:border-secondary text-secondary'
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Booking Button */}
      
      <button
        onClick={handleBooking}
        disabled={!selectedSlot}
        className="w-full py-3 accent-primary text-[var(--accent-gold)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedSlot ? 'Continue to Booking' : 'Select a Time'}
      </button>
      
      <p className="text-xs text-tertiary text-center mt-4">
        You won't be charged yet
      </p>
    </div>
  );
}
