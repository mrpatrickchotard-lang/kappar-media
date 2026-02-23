'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useParticipants,
  useRoomContext,
  useConnectionState,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, ConnectionState } from 'livekit-client';

interface VideoRoomProps {
  bookingId: string;
  expertName: string;
  clientName: string;
  scheduledEndTime: Date;
  hourlyRate: number;
  onEndCall: (actualMinutes: number, chargeAmount: number) => void;
}

// Inner component that has access to the LiveKit room context
function VideoConference({
  expertName,
  clientName,
  scheduledEndTime,
  hourlyRate,
  onEndCall,
}: Omit<VideoRoomProps, 'bookingId'>) {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const scheduledEndSeconds = Math.floor((scheduledEndTime.getTime() - Date.now()) / 1000);
  const warningTime = 15 * 60;

  // Track when call becomes active (both participants connected)
  useEffect(() => {
    if (connectionState === ConnectionState.Connected && !callActive) {
      setCallActive(true);
    }
  }, [connectionState, callActive]);

  // Timer effect
  useEffect(() => {
    if (!callActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newValue = prev + 1;
        const remaining = scheduledEndSeconds - newValue;
        if (remaining <= warningTime && remaining > 0 && !warningShown) {
          setShowWarning(true);
          setWarningShown(true);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [callActive, scheduledEndSeconds, warningShown, warningTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = useCallback(() => {
    const actualMinutes = Math.ceil(elapsedSeconds / 60);
    const chargeAmount = (actualMinutes / 60) * hourlyRate;
    room.disconnect();
    onEndCall(actualMinutes, chargeAmount);
  }, [elapsedSeconds, hourlyRate, room, onEndCall]);

  const remainingSeconds = Math.max(0, scheduledEndSeconds - elapsedSeconds);

  // Get video tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const videoTracks = tracks.filter((t) => t.source === Track.Source.Camera);
  const localTrack = videoTracks.find((t) => t.participant.isLocal);
  const remoteTrack = videoTracks.find((t) => !t.participant.isLocal);

  const remoteParticipant = participants.find((p) => !p.isLocal);

  return (
    <div className="relative">
      {/* Warning Banner */}
      {showWarning && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-500/90 text-black px-4 py-3 text-center animate-pulse">
          <p className="font-medium">15 minutes remaining! Wrap up your conversation.</p>
        </div>
      )}

      {/* Connection Status */}
      {connectionState !== ConnectionState.Connected && (
        <div className="absolute top-0 left-0 right-0 z-40 bg-[var(--accent-primary)]/90 text-white px-4 py-2 text-center">
          <p className="text-sm">
            {connectionState === ConnectionState.Connecting ? 'Connecting to video...' : 'Reconnecting...'}
          </p>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Remote Video (Expert) */}
        <div className="aspect-video bg-[#1a1a1e] rounded-xl flex items-center justify-center relative overflow-hidden">
          {remoteTrack?.publication?.track ? (
            <>
              <VideoTrack
                trackRef={remoteTrack}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 rounded-lg text-xs text-white">
                {remoteParticipant?.name || expertName}
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--mt-disc)]/30 to-transparent" />
              <div className="text-center">
                <div className="w-20 h-20 rounded-full accent-primary flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl text-[var(--accent-gold)] font-display">{expertName.charAt(0)}</span>
                </div>
                <p className="text-primary">{expertName}</p>
                <p className="text-sm text-tertiary">
                  {remoteParticipant ? 'Camera off' : 'Waiting to join...'}
                </p>
              </div>
            </>
          )}
          {connectionState === ConnectionState.Connected && (
            <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 rounded text-xs text-white flex items-center gap-1" aria-label="Live indicator">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Local Video (Client) */}
        <div className="aspect-video bg-[#1a1a1e] rounded-xl flex items-center justify-center relative overflow-hidden">
          {localTrack?.publication?.track ? (
            <>
              <VideoTrack
                trackRef={localTrack}
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 rounded-lg text-xs text-white">
                {clientName} (You)
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/30 to-transparent" />
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--sec-slate)]/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl text-secondary font-display">{clientName.charAt(0)}</span>
                </div>
                <p className="text-primary">{clientName}</p>
                <p className="text-sm text-tertiary">Camera off</p>
              </div>
            </>
          )}
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
            <div className="w-px h-10 bg-primary" />
            {/* Remaining */}
            <div className="text-center">
              <p className="text-xs text-tertiary uppercase tracking-wider">Remaining</p>
              <p className={`text-2xl font-mono ${remainingSeconds <= warningTime ? 'text-yellow-500' : 'text-primary'}`}>
                {formatTime(remainingSeconds)}
              </p>
            </div>
            <div className="w-px h-10 bg-primary" />
            {/* Current Charge */}
            <div className="text-center">
              <p className="text-xs text-tertiary uppercase tracking-wider">Current Charge</p>
              <p className="text-2xl font-mono text-[var(--accent-gold)]">
                ${((elapsedSeconds / 3600) * hourlyRate).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Participants count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-tertiary">
              <div className={`w-2 h-2 rounded-full ${remoteParticipant ? 'bg-green-500' : 'bg-yellow-500'}`} />
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </div>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              aria-label="End video call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoRoom({
  bookingId,
  expertName,
  clientName,
  scheduledEndTime,
  hourlyRate,
  onEndCall,
}: VideoRoomProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const roomName = `kappar-meeting-${bookingId}`;

  const fetchToken = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName: clientName,
          participantIdentity: `client-${bookingId}`,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to get video token');
      }
      const data = await res.json();
      setToken(data.token);
      setCallStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to video');
    } finally {
      setLoading(false);
    }
  }, [roomName, clientName, bookingId]);

  const handleEndCall = useCallback((minutes: number, charge: number) => {
    setCallEnded(true);
    onEndCall(minutes, charge);
  }, [onEndCall]);

  const scheduledEndSeconds = Math.floor((scheduledEndTime.getTime() - Date.now()) / 1000);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Waiting / Pre-call screen
  if (!callStarted || !token) {
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
          <span aria-hidden="true">&bull;</span>
          <span>Scheduled: {formatTime(scheduledEndSeconds)}</span>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={fetchToken}
          disabled={loading}
          className="px-8 py-4 bg-[var(--accent-emerald)] text-white rounded-lg hover:bg-[var(--accent-emerald)]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            'Start Video Call'
          )}
        </button>

        <p className="text-xs text-tertiary mt-4">
          Your camera and microphone will be requested
        </p>
      </div>
    );
  }

  // Call ended screen
  if (callEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-card border border-primary rounded-2xl">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-emerald)]/20 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[var(--accent-emerald)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="font-display text-2xl text-primary mb-2">Call Ended</h2>
        <p className="text-secondary">Thank you for using Kappar</p>
      </div>
    );
  }

  // Active call with LiveKit
  if (!livekitUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-card border border-primary rounded-2xl">
        <p className="text-red-400">Video service URL not configured</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={livekitUrl}
      token={token}
      connect={true}
      video={true}
      audio={true}
      style={{ height: 'auto' }}
      data-lk-theme="default"
      onDisconnected={() => {
        if (!callEnded) {
          // If disconnected unexpectedly, don't reset — let user see the state
          console.log('[LiveKit] Disconnected from room');
        }
      }}
    >
      <VideoConference
        expertName={expertName}
        clientName={clientName}
        scheduledEndTime={scheduledEndTime}
        hourlyRate={hourlyRate}
        onEndCall={handleEndCall}
      />
    </LiveKitRoom>
  );
}
