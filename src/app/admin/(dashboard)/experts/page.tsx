'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
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

interface Expert {
  id: number;
  expertId: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  hourlyRate: number;
  verified: boolean;
  featured: boolean;
  status: string;
  reviewFeedback: string | null;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(234,179,8,0.12)', text: '#ca8a04', label: 'Draft' },
  pending_review: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Pending Review' },
  published: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', label: 'Published' },
  archived: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280', label: 'Archived' },
};

const filters = ['all', 'published', 'pending_review', 'draft', 'archived'];
const filterLabels: Record<string, string> = {
  all: 'All',
  published: 'Published',
  pending_review: 'Pending Review',
  draft: 'Drafts',
  archived: 'Archived',
};

export default function AdminExpertsPage() {
  // State Management
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expert>>({});

  // Sorting and Pagination
  const { sortColumn, sortDirection, handleSort, sortData } = useSortable<Expert>();
  const { page, totalPages, total, paginatedData, setPage } = usePagination(
    sortData(getFilteredAndSearchedExperts()),
    10
  );

  // Fetch experts on mount
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch('/api/experts-manage');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setExperts(data.experts || []);
        setError('');
      } catch (err) {
        setError('Failed to load experts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  // Filter and search logic
  function getFilteredAndSearchedExperts(): Expert[] {
    let filtered = activeFilter === 'all'
      ? experts
      : experts.filter(e => e.status === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.expertise.some(exp => exp.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  // Helper to get counts
  const getCounts = useCallback(() => {
    const filtered = getFilteredAndSearchedExperts();
    return {
      all: experts.length,
      published: experts.filter(e => e.status === 'published').length,
      pending_review: experts.filter(e => e.status === 'pending_review').length,
      draft: experts.filter(e => e.status === 'draft').length,
      archived: experts.filter(e => e.status === 'archived').length,
      filtered: filtered.length,
    };
  }, [experts, activeFilter, searchQuery]);

  const counts = getCounts();

  // Handle approve action
  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/experts-manage/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) throw new Error('Failed to approve');
      setExperts(prev =>
        prev.map(e => (e.id === id ? { ...e, status: 'published' } : e))
      );
      setSuccessMsg('Expert published successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to approve expert');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete action
  const handleDelete = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/experts-manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'archived' }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setExperts(prev =>
        prev.map(e => (e.id === id ? { ...e, status: 'archived' } : e))
      );
      setSuccessMsg('Expert archived successfully');
      setDeleteDialog({ open: false, id: null });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to archive expert');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle inline edit
  const startEdit = (expert: Expert) => {
    setEditingId(expert.id);
    setEditForm(expert);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    setActionLoading(editingId);
    try {
      const res = await fetch(`/api/experts-manage/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update');
      setExperts(prev =>
        prev.map(e => (e.id === editingId ? { ...editForm as Expert } : e))
      );
      setSuccessMsg('Expert updated successfully');
      setEditingId(null);
      setEditForm({});
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update expert');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Bulk select handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(e => e.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // CSV export data
  const csvData = useMemo(() => {
    return getFilteredAndSearchedExperts().map(e => ({
      Name: e.name,
      Title: e.title,
      Company: e.company,
      Expertise: e.expertise.join('; '),
      'Hourly Rate': `$${e.hourlyRate}`,
      Status: statusColors[e.status]?.label || e.status,
      Verified: e.verified ? 'Yes' : 'No',
      Featured: e.featured ? 'Yes' : 'No',
    }));
  }, [getFilteredAndSearchedExperts()]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Experts
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Loading expert directory...
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <SkeletonTable rows={8} cols={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Experts
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage expert profiles and review status
            {counts.pending_review > 0 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs inline-block"
                style={{
                  backgroundColor: 'rgba(59,130,246,0.12)',
                  color: '#2563eb',
                }}
              >
                {counts.pending_review} pending review
              </span>
            )}
          </p>
        </div>
        <ExportCSVButton
          data={csvData}
          filename={`experts-${new Date().toISOString().split('T')[0]}`}
          columns={['Name', 'Title', 'Company', 'Expertise', 'Hourly Rate', 'Status', 'Verified', 'Featured']}
        />
      </div>

      {/* Success & Error Messages */}
      {successMsg && (
        <div
          className="p-3 rounded-xl text-sm font-body"
          style={{
            backgroundColor: 'rgba(34,197,94,0.1)',
            color: '#16a34a',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          {successMsg}
        </div>
      )}

      {error && (
        <div
          className="p-3 rounded-xl text-sm font-body"
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          {error}
        </div>
      )}

      {/* Status Filter Chips */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg text-xs font-body transition-all"
            style={{
              backgroundColor:
                activeFilter === filter ? 'var(--teal)' : 'var(--bg-card)',
              color: activeFilter === filter ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${
                activeFilter === filter
                  ? 'var(--teal)'
                  : 'var(--border-primary)'
              }`,
            }}
          >
            {filterLabels[filter]} ({filter === 'all' ? counts.all : counts[filter as keyof typeof counts] || 0})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={val => {
          setSearchQuery(val);
          setPage(1);
        }}
        placeholder="Search by name, title, company, or expertise..."
      />

      {/* Table */}
      <div
        className="admin-table-wrapper rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        {paginatedData.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm font-body">
              {searchQuery ? 'No experts match your search.' : 'No experts in this category.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border-primary)',
                }}
              >
                {/* Checkbox */}
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size > 0 &&
                      selectedIds.size === paginatedData.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded"
                    style={{
                      accentColor: 'var(--teal)',
                    }}
                    aria-label="Select all experts"
                  />
                </th>

                {/* Sortable Headers */}
                <SortableHeader
                  label="Expert"
                  column="name"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Rate"
                  column="hourlyRate"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th
                  className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Expertise
                </th>
                <SortableHeader
                  label="Status"
                  column="status"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th
                  className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((expert, index) => {
                const sc = statusColors[expert.status] || statusColors.draft;
                const isEditing = editingId === expert.id;
                const displayData = isEditing && editForm ? editForm : expert;

                return (
                  <tr
                    key={expert.id}
                    style={{
                      borderBottom:
                        index < paginatedData.length - 1
                          ? '1px solid var(--border-primary)'
                          : 'none',
                      backgroundColor:
                        isEditing ? 'rgba(42,138,122,0.05)' : 'transparent',
                    }}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(expert.id)}
                        onChange={() => toggleSelect(expert.id)}
                        className="rounded"
                        style={{
                          accentColor: 'var(--teal)',
                        }}
                        aria-label={`Select ${expert.name}`}
                      />
                    </td>

                    {/* Expert Info */}
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.name || ''}
                          onChange={e =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded text-sm"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                          placeholder="Name"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'rgba(42,138,122,0.15)' }}
                          >
                            <span
                              style={{
                                color: 'var(--teal)',
                                fontFamily: 'var(--font-display)',
                                fontSize: '16px',
                              }}
                            >
                              {displayData.name?.[0] || '?'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-sm font-body font-medium truncate"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {displayData.name}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: 'var(--text-tertiary)' }}
                            >
                              {displayData.title} at {displayData.company}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Rate */}
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={displayData.hourlyRate || 0}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              hourlyRate: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20 px-2 py-1 rounded text-sm"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                          placeholder="Rate"
                        />
                      ) : (
                        <p
                          className="text-sm font-body"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          ${displayData.hourlyRate}/hr
                        </p>
                      )}
                    </td>

                    {/* Expertise */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(displayData.expertise || [])
                          .slice(0, 2)
                          .map((exp: string) => (
                            <span
                              key={exp}
                              className="text-xs px-2 py-0.5 rounded whitespace-nowrap"
                              style={{
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-primary)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {exp}
                            </span>
                          ))}
                        {(displayData.expertise || []).length > 2 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: 'rgba(42,138,122,0.12)',
                              color: 'var(--teal)',
                            }}
                          >
                            +{(displayData.expertise || []).length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <select
                          value={displayData.status || 'draft'}
                          onChange={e =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <option value="draft">Draft</option>
                          <option value="pending_review">Pending Review</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      ) : (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap inline-block"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {sc.label}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            disabled={actionLoading === expert.id}
                            className="text-xs font-body hover:opacity-80 disabled:opacity-50 transition-opacity"
                            style={{ color: '#16a34a' }}
                          >
                            {actionLoading === expert.id
                              ? 'Saving...'
                              : 'Save'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={actionLoading === expert.id}
                            className="text-xs font-body hover:opacity-80 disabled:opacity-50 transition-opacity"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(expert)}
                            className="text-xs font-body hover:opacity-80 transition-opacity"
                            style={{ color: 'var(--teal)' }}
                          >
                            Edit
                          </button>
                          {expert.status === 'pending_review' && (
                            <button
                              onClick={() => handleApprove(expert.id)}
                              disabled={actionLoading === expert.id}
                              className="text-xs font-body hover:opacity-80 disabled:opacity-50 transition-opacity"
                              style={{ color: '#16a34a' }}
                            >
                              {actionLoading === expert.id
                                ? 'Approving...'
                                : 'Approve'}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setDeleteDialog({ open: true, id: expert.id })
                            }
                            className="text-xs font-body hover:opacity-80 transition-opacity"
                            style={{ color: '#ef4444' }}
                          >
                            Delete
                          </button>
                        </div>
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
      <Pagination
        page={page}
        totalPages={totalPages}
        total={counts.filtered}
        onPageChange={setPage}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Archive Expert"
        message="Are you sure you want to archive this expert? This action can be undone from the Archived section."
        confirmLabel="Archive"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (deleteDialog.id !== null) {
            handleDelete(deleteDialog.id);
          }
        }}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </div>
  );
}
