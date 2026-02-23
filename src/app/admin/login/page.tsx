'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    if (!resetEmail || !resetPassword) {
      setResetMsg('Email and password required');
      return;
    }
    if (resetPassword.length < 8) {
      setResetMsg('Password must be at least 8 characters');
      return;
    }
    setResetting(true);
    setResetMsg('');
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setResetMsg('Password reset success! You can now sign in.');
      setResetPassword('');
    } catch (err) {
      setResetMsg(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setLoading(false);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role || 'admin';

        if (role === 'writer') {
          router.push('/dashboard/writer');
        } else if (role === 'partner') {
          router.push('/dashboard/partner');
        } else {
          router.push('/admin');
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during sign in';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="font-display text-3xl font-light tracking-wide mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            KAPPAR
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kappar.tv"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--teal)',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Password Reset (AD4) */}
            <button
              type="button"
              onClick={() => setShowReset(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
                width: '100%',
                padding: '8px',
              }}
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Password Reset Modal */}
        {showReset && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setShowReset(false)}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2
                className="font-display"
                style={{ color: 'var(--text-primary)', fontSize: '20px', marginBottom: '8px' }}
              >
                Reset Password
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                Enter your email and a new password. This resets immediately for admin accounts.
              </p>
              {resetMsg && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: resetMsg.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${resetMsg.includes('success') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius: '8px',
                  color: resetMsg.includes('success') ? '#16a34a' : '#ef4444',
                  fontSize: '13px',
                }}>
                  {resetMsg}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="reset-email" style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="admin@kappar.tv"
                    style={{
                      width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)', borderRadius: '8px',
                      color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="reset-password" style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>New Password</label>
                  <input
                    id="reset-password"
                    type="password"
                    value={resetPassword}
                    onChange={e => setResetPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    style={{
                      width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)', borderRadius: '8px',
                      color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowReset(false)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px',
                      border: '1px solid var(--border-primary)', backgroundColor: 'transparent',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={resetting}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px',
                      border: 'none', backgroundColor: 'var(--teal)', color: 'white',
                      cursor: resetting ? 'not-allowed' : 'pointer', opacity: resetting ? 0.5 : 1,
                    }}
                  >
                    {resetting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
