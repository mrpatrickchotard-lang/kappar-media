'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

interface VideoRoomProps {
  bookingId: string;
  expertName: string;
  clientName: string;
  scheduledEndTime: Date;
  hourlyRate: number;
  onEndCall: (actualMinutes: number, chargeAmount: number) => void;
}

export default function VideoRoom({
  bookingId,
  expertName,
  clientName,
  scheduledEndTime,
  hourlyRate,
  onEndCall,
}: VideoRoomProps) {
  const [callStatus, setCallStatus] = useState<'waiting' | 'active' | 'ended'>('waiting');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  
  const scheduledEndSeconds = Math.floor((scheduledEndTime.getTime() - Date.now()) / 1000);
  const warningTime = 15 * 60; // 15 minutes in seconds
  
  // Timer effect
  useEffect(() => {
    if (callStatus !== 'active') return;
    
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newValue = prev + 1;
        
        // Show warning 15 minutes before end
        const remaining = scheduledEndSeconds - newValue;
        if (remaining <= warningTime && remaining > 0 && !warningShown) {
          setShowWarning(true);
          setWarningShown(true);
        }
        
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [callStatus, scheduledEndSeconds, warningShown]);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartCall = () => {
    setCallStatus('active');
  };
  
  const handleEndCall = () => {
    const actualMinutes = Math.ceil(elapsedSeconds / 60);
    const chargeAmount = (actualMinutes / 60) * hourlyRate;
    setCallStatus('ended');
    onEndCall(actualMinutes, chargeAmount);
  };
  
  const remainingSeconds = Math.max(0, scheduledEndSeconds - elapsedSeconds);
  
  if (callStatus === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-card border border-primary rounded-2xl">
        <div className="w-20 h-20 rounded-full accent-primary flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="font-display text-2xl text-primary mb-2">Ready to start?</h2>
        <p className="text-secondary mb-8">Your session with {expertName} is ready</p>
        
        <div className="flex items-center gap-4 mb-8 text-sm text-tertiary">
          <span>Rate: ${hourlyRate}/hr</span>
          <span>•</span>
          <span>Scheduled: {formatTime(scheduledEndSeconds)}</span>
        </div>
        
        <button
          onClick={handleStartCall}
          className="px-8 py-4 bg-[var(--accent-emerald)] text-white rounded-lg hover:bg-[var(--accent-emerald)]/90 transition-colors"
        >
          Start Video Call
        </button>      
    </div>    );
  }
  
  if (callStatus === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-card border border-primary rounded-2xl">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-emerald)]/20 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="font-display text-2xl text-primary mb-2">Call Ended</h2>
        <p className="text-secondary">Thank you for using Kappar</p>      
    </div>    );
  }
  
  return (
    <div className="relative">
      {/* Warning Banner */}
      
      {showWarning && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-500/90 text-black px-4 py-3 text-center animate-pulse">
          <p className="font-medium">⚠️ 15 minutes remaining! Wrap up your conversation.</p>        
    </div>      )}      
      
      {/* Video Grid */}
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Expert Video (Mock) */}
        
        <div className="aspect-video bg-[#1a1a1e] rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--mt-disc)]/30 to-transparent"></div>          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full accent-primary flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl text-[var(--accent-gold)] font-display">{expertName.charAt(0)}</span>            
    </div>            
            <p className="text-primary">{expertName}</p>            
            <p className="text-sm text-tertiary">Expert</p>          
    </div>          
          <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 rounded text-xs text-white flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>            LIVE
          </div>        
    </div>        
        
        {/* Client Video (Mock) */}
        
        <div className="aspect-video bg-[#1a1a1e] rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/30 to-transparent"></div>          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--sec-slate)]/30 flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl text-secondary font-display">{clientName.charAt(0)}</span>            
    </div>            
            <p className="text-primary">{clientName}</p>            
            <p className="text-sm text-tertiary">You</p>          
    </div>        
    </div>      
</div>      
      
      {/* Controls Bar */}
      
      <div className="bg-card border border-primary rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Timer */}
            
            <div className="text-center">
              <p className="text-xs text-tertiary uppercase tracking-wider">Elapsed</p>              
              <p className="text-2xl font-mono text-primary">{formatTime(elapsedSeconds)}</p>            
    </div>            
            <div className="w-px h-10 bg-primary"></div>            
            {/* Remaining */}
            
            <div className="text-center">
              <p className="text-xs text-tertiary uppercase tracking-wider">Remaining</p>              
              <p className={`text-2xl font-mono ${remainingSeconds <= warningTime ? 'text-yellow-500' : 'text-primary'}`}>
                {formatTime(remainingSeconds)}
              </p>            
    </div>            
            <div className="w-px h-10 bg-primary"></div>            
            {/* Current Charge */}
            
            <div className="text-center">
              <p className="text-xs text-tertiary uppercase tracking-wider">Current Charge</p>              
              <p className="text-2xl font-mono text-[var(--accent-gold)]">
                ${((elapsedSeconds / 3600) * hourlyRate).toFixed(2)}
              </p>            
    </div>          
    </div>          
          
          {/* End Call Button */}
          
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
            End Call
          </button>        
    </div>      
</div>    
</div>  );
}
