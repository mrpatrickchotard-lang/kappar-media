'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-light tracking-wide text-primary mb-2">
            KAPPAR ADMIN
          </h1>
          <p className="text-secondary">Sign in to manage content and experts</p>
        </div>        
        <form onSubmit={handleSubmit} className="bg-card border border-primary rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-secondary mb-2">Email</label>              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                placeholder="admin@kappar.tv"
                required
              />
            </div>            
            <div>
              <label htmlFor="password" className="block text-sm text-secondary mb-2">Password</label>              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-primary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-[var(--accent-emerald)]"
                placeholder="••••••••"
                required
              />
            </div>            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 accent-primary text-[var(--accent-gold)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>        </form>        
        <p className="text-center text-sm text-tertiary mt-6">
          Default: admin@kappar.tv / kappar2026
        </p>      
    </div>    </div>  );
}
