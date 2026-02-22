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

  const fetchData = (table: string, page: number) => {
    setLoading(true);
    setError('');
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
    if (typeof value === 'object') return JSON.stringify(value).slice(0, 80);
    const str = String(value);
    return str.length > 80 ? str.slice(0, 80) + '...' : str;
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Database Explorer
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Browse all database tables (read-only)
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

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
          {pagination.total} rows total · Page {pagination.page} of {pagination.totalPages || 1}
        </p>
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
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {columns.map(col => (
                    <td key={col} className="px-4 py-3 text-xs font-body whitespace-nowrap max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>
                      {formatValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
