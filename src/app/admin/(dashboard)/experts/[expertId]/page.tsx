'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExpertById, getExperts } from '@/lib/expert-db';

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

  useEffect(() => {
    try {
      const data = getExpertById(expertId);
      if (data) {
        setExpert(data as Expert);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [expertId]);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Expert Profile</h1>
        <p className="text-secondary mt-2">Loading...</p>
      </div>
    );
  }

  if (!expert) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Expert Not Found</h1>
        <p className="text-secondary mt-2">The expert you are looking for does not exist.</p>
        <Link
          href="/admin/experts"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            padding: '10px 20px',
            backgroundColor: 'var(--teal)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Back to Experts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/experts"
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '8px',
            }}
          >
            &larr; Back to Experts
          </Link>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">{expert.name}</h1>
          <p className="text-secondary mt-1">{expert.title} at {expert.company}</p>
        </div>
      </div>

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
                onClick={() => {
                  const newFeatured = !expert.featured;
                  setExpert({ ...expert, featured: newFeatured });
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
    </div>
  );
}
