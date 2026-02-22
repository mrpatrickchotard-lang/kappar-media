'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <h1
        className="font-display text-3xl font-light tracking-wide"
        style={{ color: 'var(--text-primary)', marginBottom: '16px' }}
      >
        Something went wrong
      </h1>
      <div
        className="rounded-xl"
        style={{
          backgroundColor: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <p className="text-sm" style={{ color: '#ef4444' }}>
          {error.message || 'An unexpected error occurred in the admin panel.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--teal)', color: '#f5f3ef' }}
      >
        Try Again
      </button>
    </div>
  );
}
