'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SkeletonTable } from '@/components/AdminShared';

interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  expertise: string[];
  hourlyRate: number;
  location: string;
  languages: string[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  totalCalls: number;
  avatar?: string;
}

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const expertId = params.expertId as string;
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Expert>>({});

  useEffect(() => {
    fetch(`/api/experts-manage?public=true`)
      .then(res => res.json())
      .then(data => {
        const found = (data.experts || []).find((e: { expertId: string }) => e.expertId === expertId);
        if (found) {
          setExpert(found as Expert);
          setEditForm(found as Expert);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [expertId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm(expert || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(expert || {});
  };

  const handleInputChange = (field: keyof Expert, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!expert) return;

    setIsSaving(true);
    try {
      const payload = {
        id: expert.id,
        name: editForm.name,
        title: editForm.title,
        company: editForm.company,
        bio: editForm.bio,
        expertise: editForm.expertise,
        hourlyRate: editForm.hourlyRate,
        location: editForm.location,
        languages: editForm.languages,
      };

      const res = await fetch('/api/experts-manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedExpert = {
          ...expert,
          ...editForm,
        } as Expert;
        setExpert(updatedExpert);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save expert:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Expert Profile</h1>
        <p className="text-secondary mt-2">Loading...</p>
        <div style={{ marginTop: '24px' }}>
          <SkeletonTable rows={3} />
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
          <Link
            href="/admin/experts"
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Experts
          </Link>
        </nav>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Expert Not Found</h1>
        <p className="text-secondary mt-2">The expert you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
        <Link
          href="/admin/experts"
          style={{
            color: 'var(--text-tertiary)',
            fontSize: '13px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Experts
        </Link>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">
            {isEditing ? 'Edit Profile' : expert.name}
          </h1>
          {!isEditing && (
            <p className="text-secondary mt-1">{expert.title} at {expert.company}</p>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--teal)',
              color: 'white',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        // Edit Mode
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h2
            style={{
              color: 'var(--text-primary)',
              fontSize: '20px',
              fontWeight: 500,
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
            }}
          >
            Edit Expert Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Title */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}
              >
                Title
              </label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Company */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}
              >
                Company
              </label>
              <input
                type="text"
                value={editForm.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}
              >
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={editForm.hourlyRate || 0}
                onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Location */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}
              >
                Location
              </label>
              <input
                type="text"
                value={editForm.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
              }}
            >
              Bio
            </label>
            <textarea
              value={editForm.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                minHeight: '120px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Expertise */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
              }}
            >
              Expertise (comma-separated)
            </label>
            <input
              type="text"
              value={(editForm.expertise || []).join(', ')}
              onChange={(e) =>
                handleInputChange(
                  'expertise',
                  e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s)
                )
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Languages */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
              }}
            >
              Languages (comma-separated)
            </label>
            <input
              type="text"
              value={(editForm.languages || []).join(', ')}
              onChange={(e) =>
                handleInputChange(
                  'languages',
                  e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s)
                )
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--teal)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                border: 'none',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid var(--border-primary)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(42, 138, 122, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    color: 'var(--teal)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {expert.name.charAt(0)}
                </span>
              </div>
              <h2
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: 500,
                  margin: '0 0 4px',
                }}
              >
                {expert.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                {expert.title}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', margin: '4px 0 0' }}>
                {expert.company}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
              {expert.verified && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(58, 170, 154, 0.15)',
                    color: 'var(--accent-emerald, #3aaa9a)',
                    fontSize: '11px',
                    borderRadius: '9999px',
                    fontWeight: 500,
                  }}
                >
                  Verified
                </span>
              )}
              {expert.featured && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    color: 'var(--accent-gold)',
                    fontSize: '11px',
                    borderRadius: '9999px',
                    fontWeight: 500,
                  }}
                >
                  Featured
                </span>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Rate</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                  ${expert.hourlyRate}/hr
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Rating</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                  {expert.rating.toFixed(1)} ({expert.reviewCount} reviews)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Total Calls</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                  {expert.totalCalls}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Location</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                  {expert.location}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Languages</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                  {expert.languages.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Bio */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '12px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Bio
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {expert.bio}
              </p>
            </div>

            {/* Expertise */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '12px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Expertise
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {expert.expertise.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      borderRadius: '8px',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '16px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Quick Actions
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  href={`/experts/${expertId}`}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--teal)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  View Public Profile
                </Link>
                <button
                  onClick={async () => {
                    const newFeatured = !expert.featured;
                    setExpert({ ...expert, featured: newFeatured });
                    try {
                      await fetch('/api/experts-manage', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: expert.id, featured: newFeatured }),
                      });
                    } catch {
                      setExpert({ ...expert, featured: !newFeatured }); // revert on failure
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {expert.featured ? 'Remove Featured' : 'Mark as Featured'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
