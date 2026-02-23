'use client';

import { useState, useRef } from 'react';

interface IllustrationGalleryProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function IllustrationGallery({ value, onChange, maxImages = 10 }: IllustrationGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setError('');
    const remaining = maxImages - value.length;
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} illustrations allowed.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);

    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large. Maximum size is 5MB per image.`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file.`);
        continue;
      }
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024 || !file.type.startsWith('image/')) continue;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        }
      } catch {
        setError('Failed to upload one or more images.');
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }
    setUploading(false);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
        Illustrations ({value.length}/{maxImages})
      </label>

      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
              <img src={url} alt={`Illustration ${idx + 1}`} className="w-full h-20 object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'rgba(220,38,38,0.85)' }}
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {value.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center py-6 rounded-xl cursor-pointer transition-all"
          style={{
            backgroundColor: dragOver ? 'rgba(42,138,122,0.08)' : 'var(--bg-tertiary)',
            border: `2px dashed ${dragOver ? 'var(--teal)' : 'var(--border-secondary)'}`,
          }}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Uploading...</span>
            </div>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                Drop images or click to add
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Multiple files supported (max {maxImages})
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>
      )}
    </div>
  );
}
