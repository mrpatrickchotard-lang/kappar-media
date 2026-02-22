'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export function ImageUpload({ value, onChange, label = 'Upload Image', accept = 'image/*' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
          <img src={value} alt="Uploaded" className="w-full h-40 object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1 rounded-lg text-xs"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            >
              Replace
            </button>
            <button
              onClick={() => onChange('')}
              className="px-3 py-1 rounded-lg text-xs"
              style={{ backgroundColor: 'rgba(220,38,38,0.8)', color: '#fff' }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center py-10 rounded-xl cursor-pointer transition-all"
          style={{
            backgroundColor: dragOver ? 'rgba(42,138,122,0.08)' : 'var(--bg-tertiary)',
            border: `2px dashed ${dragOver ? 'var(--teal)' : 'var(--border-secondary)'}`,
          }}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Uploading...</span>
            </div>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Drag & drop or click to upload
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                JPEG, PNG, WebP, GIF (max 5MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>
      )}
    </div>
  );
}
