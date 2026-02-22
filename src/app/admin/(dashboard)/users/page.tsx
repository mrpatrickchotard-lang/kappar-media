'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  partnerId: number | null;
  active: boolean;
  createdAt: string;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  writer: { bg: 'rgba(42,138,122,0.12)', text: 'var(--teal)' },
  partner: { bg: 'rgba(212,160,48,0.12)', text: '#b8941e' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'writer', partnerId: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [fetchError, setFetchError] = useState('');

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => { setUsers(data.users || []); setLoading(false); })
      .catch(() => { setFetchError('Failed to load users'); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      setError('All fields required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setCreating(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          partnerId: newUser.partnerId ? parseInt(newUser.partnerId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowCreate(false);
      setNewUser({ email: '', password: '', name: '', role: 'writer', partnerId: '' });
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const [toggleError, setToggleError] = useState('');

  const toggleActive = async (user: User) => {
    setToggleError('');
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, active: !user.active }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      fetchUsers();
    } catch {
      setToggleError(`Failed to ${user.active ? 'disable' : 'enable'} ${user.name}`);
    }
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>Users</h1>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage writers, partners, and admins</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 rounded-xl text-sm font-body"
          style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
        >
          + Create User
        </button>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <h3 className="font-display text-lg mb-4" style={{ color: 'var(--text-primary)' }}>New User</h3>
          {error && <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{error}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Full name"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              className="rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
            <input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              className="rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              className="rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            >
              <option value="writer">Writer</option>
              <option value="partner">Partner</option>
              <option value="admin">Admin</option>
            </select>
            {newUser.role === 'partner' && (
              <input
                placeholder="Partner ID (from partners table)"
                value={newUser.partnerId}
                onChange={e => setNewUser({ ...newUser, partnerId: e.target.value })}
                className="rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              />
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-5 py-2 rounded-xl text-sm font-body"
              style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
            >
              {creating ? 'Creating...' : 'Create User'}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-5 py-2 rounded-xl text-sm font-body"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error messages */}
      {(fetchError || toggleError) && (
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm" style={{ color: '#ef4444' }}>{fetchError || toggleError}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const rc = roleColors[user.role] || roleColors.writer;
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                    <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: rc.bg, color: rc.text }}>{user.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: user.active ? '#16a34a' : '#ef4444' }}>
                        {user.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(user)}
                        className="text-xs font-body hover:opacity-80"
                        style={{ color: user.active ? '#ef4444' : '#16a34a' }}
                      >
                        {user.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
