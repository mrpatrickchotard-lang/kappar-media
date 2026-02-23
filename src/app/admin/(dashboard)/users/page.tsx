'use client';

import { useState, useEffect } from 'react';
import {
  SearchBar,
  Pagination,
  ExportCSVButton,
  SortableHeader,
  ConfirmDialog,
  SkeletonTable,
  useSortable,
  usePagination,
} from '@/components/AdminShared';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  partnerId: number | null;
  active: boolean;
  createdAt: string;
}

interface EditingUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  writer: { bg: 'rgba(42,138,122,0.12)', text: 'var(--teal)' },
  partner: { bg: 'rgba(212,160,48,0.12)', text: '#b8941e' },
};

const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  return strengthScore >= 3 ? 'strong' : 'medium';
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    role: 'writer',
    partnerId: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [fetchError, setFetchError] = useState('');
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [editError, setEditError] = useState('');
  const [updatingEdit, setUpdatingEdit] = useState(false);
  const [toggleError, setToggleError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const { sortColumn, sortDirection, handleSort, sortData } = useSortable<User>();
  const filteredUsers = sortData(users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ));
  const { paginatedData: paginatedUsers, page: currentPage, totalPages, setPage: goToPage } = usePagination(filteredUsers, 10);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => { setUsers(data.users || []); setLoading(false); })
      .catch(() => { setFetchError('Failed to load users'); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Minimum 8 characters required');
    if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Must contain number');
    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setNewUser({ ...newUser, password: value });
    setPasswordErrors(validatePassword(value));
  };

  const handleCreate = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      setError('All fields required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setError('Please enter a valid email address');
      return;
    }
    const pwErrors = validatePassword(newUser.password);
    if (pwErrors.length > 0) {
      setError('Password does not meet requirements');
      return;
    }
    if (newUser.password !== newUser.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          role: newUser.role,
          partnerId: newUser.partnerId ? parseInt(newUser.partnerId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowCreate(false);
      setNewUser({ email: '', password: '', passwordConfirm: '', name: '', role: 'writer', partnerId: '' });
      setPasswordErrors([]);
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const handleEditStart = (user: User) => {
    setEditingUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    setEditError('');
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    if (!editingUser.name || !editingUser.email) {
      setEditError('Name and email required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.email)) {
      setEditError('Please enter a valid email address');
      return;
    }

    setUpdatingEdit(true);
    setEditError('');

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setUpdatingEdit(false);
    }
  };

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

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Created At'];
    const rows = users.map(u => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.active ? 'Active' : 'Disabled',
      new Date(u.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const passwordStrength = newUser.password ? getPasswordStrength(newUser.password) : null;
  const passwordStrengthColor = passwordStrength === 'strong' ? '#16a34a' : passwordStrength === 'medium' ? '#f59e0b' : '#ef4444';

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
            <div>
              <label className="block text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                placeholder="Full name"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input
                placeholder="Password (min 8 characters)"
                type="password"
                value={newUser.password}
                onChange={e => handlePasswordChange(e.target.value)}
                className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              />
              {newUser.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>Strength:</span>
                    <span className="text-xs font-body px-2 py-0.5 rounded" style={{ backgroundColor: passwordStrengthColor + '20', color: passwordStrengthColor }}>
                      {passwordStrength}
                    </span>
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="text-xs space-y-0.5">
                      {passwordErrors.map((err, i) => (
                        <p key={i} style={{ color: '#ef4444' }}>• {err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
              <input
                placeholder="Confirm password"
                type="password"
                value={newUser.passwordConfirm}
                onChange={e => setNewUser({ ...newUser, passwordConfirm: e.target.value })}
                className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>Role</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              >
                <option value="writer">Writer</option>
                <option value="partner">Partner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {newUser.role === 'partner' && (
              <div>
                <label className="block text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>Partner ID</label>
                <input
                  placeholder="Partner ID (from partners table)"
                  value={newUser.partnerId}
                  onChange={e => setNewUser({ ...newUser, partnerId: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                />
              </div>
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
              onClick={() => {
                setShowCreate(false);
                setNewUser({ email: '', password: '', passwordConfirm: '', name: '', role: 'writer', partnerId: '' });
                setPasswordErrors([]);
                setError('');
              }}
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

      {/* Search and Export */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <ExportCSVButton data={filteredUsers} filename="users" columns={['name', 'email', 'role', 'active', 'createdAt']} />
      </div>

      {/* Users Table */}
      <div className="admin-table-wrapper rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        {loading ? (
          <SkeletonTable columns={6} rows={5} />
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <SortableHeader
                  label="Name"
                  column="name"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Email"
                  column="email"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Role"
                  column="role"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Status"
                  column="active"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Created"
                  column="createdAt"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => {
                const rc = roleColors[user.role] || roleColors.writer;
                const isEditing = editingUser?.id === user.id;

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-primary)' }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                          className="rounded px-2 py-1 outline-none text-sm"
                          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="rounded px-2 py-1 outline-none text-sm"
                          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <select
                          value={editingUser.role}
                          onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="rounded px-2 py-1 outline-none text-xs"
                          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                        >
                          <option value="writer">Writer</option>
                          <option value="partner">Partner</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: rc.bg, color: rc.text }}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: user.active ? '#16a34a' : '#ef4444' }}>
                        {user.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                      <time dateTime={user.createdAt}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </time>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleEditSave}
                              disabled={updatingEdit}
                              className="text-xs font-body hover:opacity-80"
                              style={{ color: '#16a34a' }}
                            >
                              {updatingEdit ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(null);
                                setEditError('');
                              }}
                              className="text-xs font-body hover:opacity-80"
                              style={{ color: '#ef4444' }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(user)}
                              className="text-xs font-body hover:opacity-80"
                              style={{ color: 'var(--accent-primary)' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleActive(user)}
                              className="text-xs font-body hover:opacity-80"
                              style={{ color: user.active ? '#ef4444' : '#16a34a' }}
                            >
                              {user.active ? 'Disable' : 'Enable'}
                            </button>
                          </>
                        )}
                      </div>
                      {editError && isEditing && (
                        <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{editError}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Confirm Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          open={true}
          title="Delete User"
          message={`Are you sure you want to delete ${deleteConfirm.name}?`}
          variant="danger"
          onConfirm={() => {
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
