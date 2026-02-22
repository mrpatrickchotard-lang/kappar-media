'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getExperts } from '@/lib/expert-db';

interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  hourlyRate: number;
  verified: boolean;
  featured: boolean;
}

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getExperts();
      setExperts(data as Expert[]);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Experts</h1>
        <p className="text-secondary mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Experts</h1>
          <p className="text-secondary mt-2">Manage your expert network</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-primary)',
            padding: '20px 24px',
          }}
        >
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Total Experts: {experts.length}
          </p>
        </div>

        {experts.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
            }}
          >
            <p>No experts yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border-primary)',
                }}
              >
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Expert
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Expertise
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '16px 24px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border-primary)' }}>
              {experts.map((expert, index) => (
                <tr
                  key={expert.id}
                  style={{
                    borderBottom:
                      index < experts.length - 1
                        ? '1px solid var(--border-primary)'
                        : 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(42, 138, 122, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--teal)',
                            fontFamily: 'var(--font-display)',
                            fontSize: '16px',
                          }}
                        >
                          {expert.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p
                          style={{
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {expert.name}
                        </p>
                        <p
                          style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '12px',
                            margin: '2px 0 0',
                          }}
                        >
                          {expert.title} at {expert.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {expert.expertise.slice(0, 2).map((exp: string) => (
                        <span
                          key={exp}
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-secondary)',
                            fontSize: '11px',
                            borderRadius: '4px',
                          }}
                        >
                          {exp}
                        </span>
                      ))}
                      {expert.expertise.length > 2 && (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            color: 'var(--text-tertiary)',
                            fontSize: '11px',
                          }}
                        >
                          +{expert.expertise.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '16px 24px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                    }}
                  >
                    ${expert.hourlyRate}/hr
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {expert.verified && (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
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
                            padding: '4px 10px',
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
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <Link
                      href={`/admin/experts/${expert.id}`}
                      style={{
                        color: 'var(--teal)',
                        fontSize: '13px',
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
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
