'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ===================== CONFIRM DIALOG (AD3) =====================
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onCancel();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  const colors = {
    danger: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', btn: '#ef4444' },
    warning: { bg: 'rgba(234,179,8,0.15)', text: '#ca8a04', btn: '#ca8a04' },
    info: { bg: 'rgba(59,130,246,0.15)', text: '#2563eb', btn: '#2563eb' },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full mx-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.bg }}>
          <svg className="w-6 h-6" style={{ color: colors.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 id="confirm-title" className="font-display text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p id="confirm-message" className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-body"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-body text-white"
            style={{ backgroundColor: colors.btn }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== SEARCH BAR (AD10) =====================
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: 'var(--text-tertiary)' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-body focus:outline-none"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-primary)',
        }}
        aria-label={placeholder}
      />
    </div>
  );
}

// ===================== PAGINATION (AD9) =====================
export function Pagination({
  page,
  currentPage,
  totalPages,
  total,
  onPageChange,
}: {
  page?: number;
  currentPage?: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}) {
  // Support both 'page' and 'currentPage' prop names
  page = page ?? currentPage ?? 1;
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
        {total !== undefined ? `${total} total · ` : ''}Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg text-xs font-body disabled:opacity-30 transition-all"
          style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
          aria-label="Previous page"
        >
          &larr; Prev
        </button>
        {/* Page number buttons */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className="w-8 h-8 rounded-lg text-xs font-body transition-all"
              style={{
                backgroundColor: page === pageNum ? 'var(--teal)' : 'transparent',
                color: page === pageNum ? '#fff' : 'var(--text-secondary)',
                border: page === pageNum ? 'none' : '1px solid var(--border-primary)',
              }}
              aria-current={page === pageNum ? 'page' : undefined}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-xs font-body disabled:opacity-30 transition-all"
          style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
          aria-label="Next page"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

// ===================== CSV EXPORT (AD13) =====================
export function ExportCSVButton({
  data,
  filename,
  columns,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  filename: string;
  columns?: string[];
}) {
  const handleExport = () => {
    if (data.length === 0) return;
    const cols = columns || Object.keys(data[0]);
    const header = cols.join(',');
    const rows = data.map(row =>
      cols.map(col => {
        const val = row[col];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-3 py-2 rounded-lg text-xs font-body transition-all flex items-center gap-1.5"
      style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
      aria-label={`Export ${filename} as CSV`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </button>
  );
}

// ===================== SORT HEADER (AD12) =====================
export type SortDirection = 'asc' | 'desc' | null;

export function SortableHeader({
  label,
  column,
  currentSort,
  currentDirection,
  onSort,
}: {
  label: string;
  column: string;
  currentSort: string | null;
  currentDirection: SortDirection;
  onSort: (column: string) => void;
}) {
  const active = currentSort === column;
  return (
    <th
      className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body cursor-pointer select-none hover:opacity-80 transition-opacity"
      style={{ color: active ? 'var(--teal)' : 'var(--text-tertiary)' }}
      onClick={() => onSort(column)}
      role="columnheader"
      aria-sort={active ? (currentDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (
          <span aria-hidden="true">{currentDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </span>
    </th>
  );
}

// ===================== SKELETON TABLE (AD18) =====================
export function SkeletonTable({ rows = 5, cols, columns, className }: { rows?: number; cols?: number; columns?: number; className?: string }) {
  cols = cols ?? columns ?? 5;
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="skeleton h-8 flex-1"
              style={{ animationDelay: `${(i * cols + j) * 0.1}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ===================== SORT UTILITY =====================
export function useSortable<T>() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') setSortColumn(null);
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const sortData = useCallback((data: T[]) => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortColumn];
      const bVal = (b as Record<string, unknown>)[sortColumn];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [sortColumn, sortDirection]);

  return { sortColumn, sortDirection, handleSort, sortData };
}

// ===================== PAGINATION UTILITY =====================
export function usePagination<T>(data: T[], itemsPerPage = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedData = data.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    page: safePage,
    totalPages,
    total: data.length,
    paginatedData,
    setPage,
  };
}
