'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SearchBar, Pagination, ExportCSVButton, SortableHeader, ConfirmDialog, SkeletonTable, useSortable } from '@/components/AdminShared';

interface Partner {
  id: number;
  slug: string;
  name: string;
  description: string;
  industry: string;
  services: string[];
  website: string | null;
  partnershipType: string;
  featured: boolean;
  partnerSince: string | null;
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

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; industry: string; status: string }>({ name: '', industry: '', status: '' });
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; partnerId: number | null; partnerName: string }>({ isOpen: false, partnerId: null, partnerName: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const { sortColumn, sortDirection, handleSort, sortData } = useSortable<Partner>();

  useEffect(() => {
    fetch('/api/partners-manage')
      .then(res => res.json())
      .then(data => {
        setPartners(data.partners || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load partners');
        setLoading(false);
      });
  }, []);

  const filteredPartners = partners.filter(p => {
    if (activeFilter !== 'all' && p.status !== activeFilter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.industry.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  const displayPartners = sortData(filteredPartners);

  const pageSize = 10;
  const totalPages = Math.ceil(displayPartners.length / pageSize);
  const paginatedData = displayPartners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingCount = partners.filter(p => p.status === 'pending_review').length;

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/partners-manage/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) throw new Error('Failed');
      setPartners(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
      setSuccessMsg('Partner published');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch { setError('Failed to approve'); }
    finally { setActionLoading(null); }
  };

  const handleStartEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setEditForm({ name: partner.name, industry: partner.industry, status: partner.status });
  };

  const handleSaveEdit = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/partners-manage/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed');
      setPartners(prev => prev.map(p => p.id === id ? { ...p, ...editForm } : p));
      setSuccessMsg('Partner updated');
      setTimeout(() => setSuccessMsg(''), 3000);
      setEditingId(null);
    } catch { setError('Failed to update partner'); }
    finally { setActionLoading(null); }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', industry: '', status: '' });
  };

  const handleOpenArchiveDialog = (id: number, name: string) => {
    setConfirmDialog({ isOpen: true, partnerId: id, partnerName: name });
  };

  const handleConfirmArchive = async () => {
    if (!confirmDialog.partnerId) return;
    setActionLoading(confirmDialog.partnerId);
    try {
      const res = await fetch(`/api/partners-manage/${confirmDialog.partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      if (!res.ok) throw new Error('Failed');
      setPartners(prev => prev.map(p => p.id === confirmDialog.partnerId ? { ...p, status: 'archived' } : p));
      setSuccessMsg('Partner archived');
      setTimeout(() => setSuccessMsg(''), 3000);
      setConfirmDialog({ isOpen: false, partnerId: null, partnerName: '' });
    } catch { setError('Failed to archive partner'); }
    finally { setActionLoading(null); }
  };

  const handleCancelArchive = () => {
    setConfirmDialog({ isOpen: false, partnerId: null, partnerName: '' });
  };

  const csvData = filteredPartners.map(p => ({
    Name: p.name,
    Industry: p.industry,
    Type: p.partnershipType,
    Status: statusColors[p.status]?.label || p.status,
    Description: p.description,
  }));

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Partners</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading partners...</p>
        </div>
        <div className="mt-8">
          <SkeletonTable columns={5} rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Partners</h1>
          <p className="text-secondary text-sm mt-1">
            {partners.length} total partners
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#2563eb' }}>
                {pendingCount} pending review
              </span>
            )}
          </p>
        </div>
        <ExportCSVButton data={csvData} filename="partners.csv" />
      </div>

      {successMsg && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search by name, industry, or description..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(filter => {
          const count = filter === 'all' ? partners.length : partners.filter(p => p.status === filter).length;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-lg text-xs font-body transition-all"
              style={{
                backgroundColor: activeFilter === filter ? 'var(--teal)' : 'var(--bg-card)',
                color: activeFilter === filter ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeFilter === filter ? 'var(--teal)' : 'var(--border-primary)'}`,
              }}
            >
              {filterLabels[filter]} ({count})
            </button>
          );
        })}
      </div>

      <div className="admin-table-wrapper" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
        {displayPartners.length === 0 ? (
          <div className="p-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">No partners match this filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  <SortableHeader label="Partner" column="name" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                </th>
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  <SortableHeader label="Industry" column="industry" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                </th>
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  <SortableHeader label="Type" column="partnershipType" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                </th>
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  <SortableHeader label="Status" column="status" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                </th>
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase font-body" style={{ color: 'var(--text-tertiary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((partner, index) => {
                const sc = statusColors[partner.status] || statusColors.draft;
                const isEditing = editingId === partner.id;
                return (
                  <tr key={partner.id} style={{ borderBottom: index < paginatedData.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 rounded text-sm"
                          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(42,138,122,0.15)' }}>
                            <span style={{ color: 'var(--teal)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>{partner.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-body font-medium" style={{ color: 'var(--text-primary)' }}>{partner.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {partner.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.industry}
                          onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                          className="w-full px-2 py-1 rounded text-sm"
                          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                        />
                      ) : (
                        partner.industry
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: 'rgba(42,138,122,0.1)', color: 'var(--teal)' }}>
                        {partner.partnershipType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                        >
                          {Object.keys(statusColors).map(key => (
                            <option key={key} value={key}>{statusColors[key].label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.label}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(partner.id)}
                              disabled={actionLoading === partner.id}
                              className="text-xs font-body hover:opacity-80 disabled:opacity-50"
                              style={{ color: '#16a34a' }}
                            >
                              {actionLoading === partner.id ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-xs font-body hover:opacity-80"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Link href={`/partners/${partner.slug}`} target="_blank" className="text-xs font-body hover:opacity-80" style={{ color: 'var(--teal)' }}>
                              View
                            </Link>
                            <button
                              onClick={() => handleStartEdit(partner)}
                              className="text-xs font-body hover:opacity-80"
                              style={{ color: 'var(--teal)' }}
                            >
                              Edit
                            </button>
                            {partner.status === 'pending_review' && (
                              <button
                                onClick={() => handleApprove(partner.id)}
                                disabled={actionLoading === partner.id}
                                className="text-xs font-body hover:opacity-80 disabled:opacity-50"
                                style={{ color: '#16a34a' }}
                              >
                                {actionLoading === partner.id ? 'Approving...' : 'Approve'}
                              </button>
                            )}
                            {partner.status !== 'archived' && (
                              <button
                                onClick={() => handleOpenArchiveDialog(partner.id, partner.name)}
                                disabled={actionLoading === partner.id}
                                className="text-xs font-body hover:opacity-80 disabled:opacity-50"
                                style={{ color: '#ef4444' }}
                              >
                                {actionLoading === partner.id ? 'Archiving...' : 'Archive'}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {displayPartners.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.isOpen}
        title="Archive Partner"
        message={`Are you sure you want to archive "${confirmDialog.partnerName}"? This action can be undone by changing the status back.`}
        onConfirm={handleConfirmArchive}
        onCancel={handleCancelArchive}
        confirmLabel="Archive"
        cancelLabel="Cancel"
        variant="warning"
      />
    </div>
  );
}
