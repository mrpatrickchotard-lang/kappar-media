'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { IllustrationGallery } from '@/components/IllustrationGallery';

const categories = ['Tech', 'Business', 'Marketing', 'Lifestyle', 'Real Estate'];
const contentTypes = [
  { value: 'text', label: 'Text', description: 'Standard article' },
  { value: 'video', label: 'Video', description: 'Video-focused content' },
  { value: 'mixed', label: 'Mixed', description: 'Text + video' },
];

function isValidVideoUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)/.test(url);
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [contentType, setContentType] = useState('text');
  const [videoUrl, setVideoUrl] = useState('');
  const [illustrations, setIllustrations] = useState<string[]>([]);

  const handleSave = async (status: 'draft' | 'pending_review') => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError('Title, excerpt, and content are required');
      return;
    }

    if ((contentType === 'video' || contentType === 'mixed') && videoUrl && !isValidVideoUrl(videoUrl)) {
      setError('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          featuredImage: featuredImage || null,
          thumbnail: thumbnail || null,
          contentType,
          videoUrl: videoUrl || null,
          illustrations,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/dashboard/writer');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide" style={{ color: 'var(--text-primary)' }}>
            New Article
          </h1>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Write and submit your content for review
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-body transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('pending_review')}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-body transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
          >
            {saving ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 p-3 rounded-xl text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(42,138,122,0.08)', color: 'var(--teal)', border: '1px solid rgba(42,138,122,0.2)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Articles are reviewed by an admin before publishing
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main editor */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Article title..."
              className="w-full font-display text-3xl font-light tracking-wide outline-none bg-transparent"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Brief description of the article..."
              rows={3}
              className="w-full rounded-xl p-4 outline-none resize-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>

          {/* Video URL (shown for video or mixed) */}
          {(contentType === 'video' || contentType === 'mixed') && (
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Main Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
              />
              {videoUrl && !isValidVideoUrl(videoUrl) && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>Enter a valid YouTube or Vimeo URL</p>
              )}
            </div>
          )}

          {/* Rich Text Editor */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Content
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your article..."
            />
          </div>

          {/* Illustrations */}
          <IllustrationGallery
            value={illustrations}
            onChange={setIllustrations}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Content Type
            </label>
            <div className="space-y-2">
              {contentTypes.map(ct => (
                <label
                  key={ct.value}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    backgroundColor: contentType === ct.value ? 'rgba(42,138,122,0.08)' : 'var(--bg-card)',
                    border: `1px solid ${contentType === ct.value ? 'var(--teal)' : 'var(--border-primary)'}`,
                  }}
                >
                  <input
                    type="radio"
                    name="contentType"
                    value={ct.value}
                    checked={contentType === ct.value}
                    onChange={() => setContentType(ct.value)}
                    className="accent-[var(--teal)]"
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ct.label}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{ct.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <ImageUpload
            value={featuredImage}
            onChange={setFeaturedImage}
            label="Featured Image"
          />

          {/* Custom Thumbnail */}
          <div>
            <ImageUpload
              value={thumbnail}
              onChange={setThumbnail}
              label="Custom Thumbnail (optional)"
            />
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Used on article cards and social sharing. Leave empty to use featured image.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm appearance-none"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="AI, fintech, innovation"
              className="w-full rounded-xl px-4 py-3 outline-none font-body text-sm"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
