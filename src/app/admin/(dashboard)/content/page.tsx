'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllArticles } from '@/lib/content';

interface Article {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  featured?: boolean;
  tags: string[];
}

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllArticles()
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load articles');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
          <p className="text-secondary text-sm">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Content Management</h1>
          <p className="text-secondary mt-2">Manage your published articles</p>
        </div>
        <Link
          href="/dashboard/writer/articles/new"
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--teal)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          New Article
        </Link>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '20px 24px'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0
          }}>
            Total Articles: {articles.length}
          </p>
        </div>

        {articles.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-tertiary)'
          }}>
            <p>No articles yet. Create your first article to get started.</p>
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-primary)'
              }}>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Title</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Category</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Author</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Date</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Status</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Tags</th>
                <th style={{
                  textAlign: 'right',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border-primary)' }}>
              {articles.map((article, index) => (
                <tr
                  key={article.slug}
                  style={{
                    borderBottom: index < articles.length - 1 ? '1px solid var(--border-primary)' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{
                    padding: '16px 24px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    maxWidth: '250px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {article.title}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {article.category}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {article.author}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td style={{
                    padding: '16px 24px'
                  }}>
                    {article.featured && (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: 'var(--teal)',
                        color: 'white',
                        fontSize: '11px',
                        borderRadius: '9999px',
                        fontWeight: 500
                      }}>
                        Featured
                      </span>
                    )}
                  </td>
                  <td style={{
                    padding: '16px 24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap',
                      maxWidth: '150px'
                    }}>
                      {article.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-secondary)',
                            fontSize: '11px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-body)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          color: 'var(--text-tertiary)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-body)'
                        }}>
                          +{article.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    textAlign: 'right'
                  }}>
                    <Link
                      href={`/articles/${article.slug}`}
                      style={{
                        color: 'var(--teal)',
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'text-decoration 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      Edit
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
