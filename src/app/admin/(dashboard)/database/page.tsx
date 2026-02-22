'use client';

import { useState, useEffect } from 'react';

const TABLES = [
  'articles', 'partners', 'events', 'users', 'experts',
  'bookings', 'contact_submissions', 'newsletter_subscribers',
];

export default function DatabaseExplorer() {
  const [selectedTable, setSelectedTable] = useState('articles');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchData = (table: string, page: number) => {
    setLoading(true);
    setError('');
    setEditingRow(null);
    fetch(`/api/database?table=${table}&page=${page}&limit=25`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setRows([]);
        } else {
          setRows(data.rows || []);
          setPagination(data.pagination || { page: 1, limit: 25, total: 0, totalPages: 0 });
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedTable, 1);
  }, [selectedTable]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const displayValue = (value: unknown): string => {
    const str = formatValue(value);
    return str.length > 80 ? str.slice(0, 80) + '...' : str;
  };

  const startEdit = (rowIndex: number) => {
    const row = rows[rowIndex];
    const data: Record<string, string> = {};
    for (const col of columns) {
      if (col === 'id') continue; // Don't edit IDs
      data[col] = formatValue(row[col]);
    }
    setEditData(data);
    setEditingRow(rowIndex);
    setFeedback('');
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditData({});
    setFeedback('');
  };

  const saveEdit = async () => {
    if (editingRow === null) return;
    setSaving(true);
    setFeedback('');

    const row = rows[editingRow];
    const id = row.id;

    // Only send changed fields
    const changes: Record<string, string> = {};
    for (const col of columns) {
      if (col === 'id') continue;
      const original = formatValue(row[col]);
      if (editData[col] !== original) {
        changes[col] = editData[col];
      }
    }

    if (Object.keys(changes).length === 0) {
      setFeedback('No changes');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/database', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: selectedTable, id, data: changes }),
      });
      const result = await res.json();
      if (result.success) {
        setFeedback('Saved');
        setEditingRow(null);
        fetchData(selectedTable, pagination.page);
      } else {
        setFeedback(result.error || 'Save failed');
      }
    } catch {
      setFeedback('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (rowIndex: number) => {
    const row = rows[rowIndex];
    const id = row.id;

    if (!confirm(`Delete row #${id} from ${selectedTable}? This cannot be undone.`)) return;

    try {
      const res = await fetch('/api/database', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: selectedTable, id }),
      });
      const result = await res.json();
      if (result.success) {
        setFeedback('Row deleted');
        fetchData(selectedTable, pagination.page);
      } else {
        setFeedback(result.error || 'Delete failed');
      }
    } catch {
      setFeedback('Delete failed');
    }
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Database Explorer
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Browse and edit database tables
        </p>
      </div>

      {/* Table selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {TABLES.map(table => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className="px-4 py-2 rounded-full text-sm font-body transition-all"
            style={{
              backgroundColor: selectedTable === table ? 'var(--accent-primary)' : 'transparent',
              color: selectedTable === table ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${selectedTable === table ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
            }}
          >
            {table.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Stats bar + feedback */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <p className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
            {pagination.total} rows total · Page {pagination.page} of {pagination.totalPages || 1}
          </p>
          {feedback && (
            <span
              className="text-xs font-body px-2 py-1 rounded"
              style={{
                backgroundColor: feedback === 'Saved' || feedback === 'Row deleted'
                  ? 'rgba(34, 197, 94, 0.15)'
                  : feedback === 'No changes'
                    ? 'rgba(212, 175, 55, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                color: feedback === 'Saved' || feedback === 'Row deleted'
                  ? '#22c55e'
                  : feedback === 'No changes'
                    ? '#d4af37'
                    : '#ef4444',
              }}
            >
              {feedback}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchData(selectedTable, pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-1 rounded-lg text-xs font-body disabled:opacity-30"
            style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
          >
            ← Prev
          </button>
          <button
            onClick={() => fetchData(selectedTable, pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1 rounded-lg text-xs font-body disabled:opacity-30"
            style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-xl overflow-x-auto" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-body" style={{ color: 'var(--text-tertiary)' }}>No data in this table</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {columns.map(col => (
                  <th key={col} className="px-4 py-3 text-[10px] tracking-widest uppercase font-body whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                    {col.replace(/_/g, ' ')}
                  </th>
                ))}
                <th className="px-4 py-3 text-[10px] tracking-widest uppercase font-body whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {columns.map(col => (
                    <td key={col} className="px-4 py-3 text-xs font-body whitespace-nowrap max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
                      {editingRow === i && col !== 'id' ? (
                        <input
                          value={editData[col] || ''}
                          onChange={(e) => setEditData({ ...editData, [col]: e.target.value })}
                          className="w-full px-2 py-1 rounded text-xs font-body outline-none"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-primary)',
                            minWidth: '100px',
                          }}
                        />
                      ) : (
                        <span className="truncate block max-w-[200px]">{displayValue(row[col])}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingRow === i ? (
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="text-xs font-body px-2 py-1 rounded"
                          style={{ backgroundColor: 'var(--teal)', color: 'white' }}
                        >
                          {saving ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs font-body px-2 py-1 rounded"
                          style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(i)}
                          className="text-xs font-body hover:underline"
                          style={{ color: 'var(--teal)' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRow(i)}
                          className="text-xs font-body hover:underline"
                          style={{ color: '#ef4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
