'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { RichTextEditor } from '@/components/RichTextEditor';
import Link from 'next/link';

interface PartnerData {
  id: number;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  industry: string;
  services: string[];
  website: string;
  founded: string;
  headquarters: string;
  employees: string;
  partnershipType: string;
  partnerSince: string;
  collaborationAreas: string[];
  keyHighlights: string[];
  socialLinks: Record<string, string>;
  logoUrl: string;
  status: string;
  reviewFeedback: string | null;
}

const statusInfo: Record<string, { bg: string; text: string; label: string; description: string }> = {
  draft: { bg: 'rgba(234,179,8,0.12)', text: '#ca8a04', label: 'Draft', description: 'Not yet submitted for review' },
  pending_review: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Pending Review', description: 'Awaiting admin approval' },
  published: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', label: 'Published', description: 'Visible on the public site' },
  archived: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280', label: 'Archived', description: 'Not visible on the public site' },
};

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Editable fields
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [services, setServices] = useState('');
  const [website, setWebsite] = useState('');
  const [employees, setEmployees] = useState('');
  const [highlights, setHighlights] = useState('');
  const [collabAreas, setCollabAreas] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetch('/api/partners-manage')
      .then(res => res.json())
      .then(data => {
        const p = data.partners?.[0];
        if (p) {
          setPartner(p);
          setDescription(p.description || '');
          setLongDescription(p.longDescription || '');
          setServices((p.services || []).join(', '));
          setWebsite(p.website || '');
          setEmployees(p.employees || '');
          setHighlights((p.keyHighlights || []).join('\n'));
          setCollabAreas((p.collaborationAreas || []).join('\n'));
          setLinkedin(p.socialLinks?.linkedin || '');
          setTwitter(p.socialLinks?.twitter || '');
          setLogoUrl(p.logoUrl || '');
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load partner data'); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!partner) return;
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/partners-manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: partner.id,
          description,
          longDescription,
          services: services.split(',').map(s => s.trim()).filter(Boolean),
          website,
          employees,
          keyHighlights: highlights.split('\n').map(h => h.trim()).filter(Boolean),
          collaborationAreas: collabAreas.split('\n').map(c => c.trim()).filter(Boolean),
          socialLinks: { linkedin, twitter },
          logoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>No Partner Profile Found</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your account is not linked to a partner profile yet. Please contact the admin.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
              {partner.name}
            </h1>
            {partner.status && statusInfo[partner.status] && (
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: statusInfo[partner.status].bg, color: statusInfo[partner.status].text }}>
                {statusInfo[partner.status].label}
              </span>
            )}
          </div>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Edit your partner profile · <Link href={`/partners/${partner.slug}`} style={{ color: 'var(--teal)' }} target="_blank">View public page →</Link>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-body transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: saved ? '#16a34a' : 'var(--accent-primary)', color: '#fff' }}
        >
          {saving ? 'Saving...' : saved ? 'Submitted for Review' : 'Save & Submit for Review'}
        </button>
      </div>

      {/* Review info banner */}
      <div className="mb-6 p-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: '#2563eb' }}>
        Profile changes are reviewed by an admin before going live on the public site.
      </div>

      {/* Review feedback (if rejected) */}
      {partner.reviewFeedback && partner.status === 'draft' && (
        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <p className="text-xs font-body font-medium mb-1" style={{ color: '#ca8a04' }}>Admin Feedback</p>
          <p className="text-sm font-body" style={{ color: 'var(--text-primary)' }}>{partner.reviewFeedback}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main content */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Short Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl p-4 outline-none resize-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          {/* Long Description (Rich Text) */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              About the Partnership
            </label>
            <RichTextEditor content={longDescription} onChange={setLongDescription} />
          </div>

          {/* Key Highlights */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Key Highlights (one per line)
            </label>
            <textarea
              value={highlights}
              onChange={e => setHighlights(e.target.value)}
              rows={4}
              placeholder="$2.5B+ Assets Under Advisory&#10;45+ Completed Transactions"
              className="w-full rounded-xl p-4 outline-none resize-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          {/* Collaboration Areas */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Collaboration Areas (one per line)
            </label>
            <textarea
              value={collabAreas}
              onChange={e => setCollabAreas(e.target.value)}
              rows={3}
              placeholder="Joint Research Reports&#10;Co-hosted Events"
              className="w-full rounded-xl p-4 outline-none resize-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Company Logo" />

          {/* Read-only info */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-tertiary)' }}>Company Info</h3>
            {[
              { label: 'Industry', value: partner.industry },
              { label: 'Headquarters', value: partner.headquarters },
              { label: 'Founded', value: partner.founded },
              { label: 'Partnership Type', value: partner.partnershipType },
              { label: 'Partner Since', value: partner.partnerSince },
            ].map(item => (
              <div key={item.label} className="mb-3">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                <p className="text-sm font-body" style={{ color: 'var(--text-primary)' }}>{item.value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Editable fields */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Services (comma separated)
            </label>
            <input
              type="text"
              value={services}
              onChange={e => setServices(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>Website</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>Employees</label>
            <input
              type="text"
              value={employees}
              onChange={e => setEmployees(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>LinkedIn URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>Twitter/X URL</label>
            <input
              type="url"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
