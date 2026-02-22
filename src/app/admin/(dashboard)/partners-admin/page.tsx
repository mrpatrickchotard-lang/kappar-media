'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners-manage')
      .then((res) => res.json())
      .then((data) => {
        setPartners(data.partners || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Partners</h1>
        <p className="text-secondary mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Partners</h1>
          <p className="text-secondary mt-2">Manage your partner network</p>
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
            Total Partners: {partners.length}
          </p>
        </div>

        {partners.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
            }}
          >
            <p>No partners yet.</p>
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
                  Partner
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
                  Industry
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
                  Type
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
              {partners.map((partner, index) => (
                <tr
                  key={partner.id}
                  style={{
                    borderBottom:
                      index < partners.length - 1
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
                  <td
                    style={{
                      padding: '16px 24px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {partner.name}
                      </p>
                      <p
                        style={{
                          color: 'var(--text-tertiary)',
                          fontSize: '12px',
                          margin: '4px 0 0',
                          maxWidth: '300px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {partner.description}
                      </p>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                    }}
                  >
                    {partner.industry}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: 'rgba(42, 138, 122, 0.1)',
                        color: 'var(--teal)',
                        fontSize: '11px',
                        borderRadius: '9999px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {partner.partnershipType}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {partner.featured && (
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
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <Link
                      href={`/partners/${partner.slug}`}
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
