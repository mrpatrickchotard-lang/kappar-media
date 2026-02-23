'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useRef, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        backgroundColor: active ? 'rgba(42,138,122,0.15)' : 'transparent',
        color: active ? 'var(--teal)' : 'var(--text-secondary)',
        border: `1px solid ${active ? 'var(--teal)' : 'transparent'}`,
      }}
    >
      {children}
    </button>
  );
}

/**
 * Parse a YouTube or Vimeo URL and return the embed URL.
 * Returns null if the URL is not a valid video URL.
 */
function parseVideoUrl(url: string): { embedUrl: string; provider: 'youtube' | 'vimeo' } | null {
  // YouTube patterns
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`, provider: 'youtube' };
  }

  // Vimeo patterns
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, provider: 'vimeo' };
  }

  return null;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-lg w-full aspect-video',
          style: 'max-width: 100%; height: auto; aspect-ratio: 16/9;',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-editor min-h-[300px] outline-none p-4 font-body text-sm leading-relaxed',
        style: 'color: var(--text-primary)',
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image too large. Maximum size is 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed');
        return;
      }
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch {
      setUploadError('Failed to upload image. Please try again.');
    }
  };

  const handleVideoEmbed = () => {
    const url = window.prompt('Enter YouTube or Vimeo URL:');
    if (!url) return;
    setUploadError('');

    const parsed = parseVideoUrl(url.trim());
    if (!parsed) {
      setUploadError('Invalid video URL. Please use a YouTube or Vimeo link.');
      return;
    }

    if (parsed.provider === 'youtube') {
      editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
    } else {
      // For Vimeo, insert as a responsive iframe
      editor.chain().focus().insertContent(
        `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;border-radius:12px;margin:1rem 0;">` +
        `<iframe src="${parsed.embedUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ` +
        `style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:12px;" title="Vimeo video"></iframe></div>`
      ).run();
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 p-2 flex-wrap rounded-t-xl"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border-secondary)' }} />

        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border-secondary)' }} />

        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          &bull; List
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          &ldquo; Quote
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border-secondary)' }} />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
        >
          Image
        </ToolbarButton>

        <ToolbarButton
          onClick={handleVideoEmbed}
          title="Embed Video (YouTube/Vimeo)"
        >
          Video
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          &mdash; HR
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        className="rounded-b-xl min-h-[300px]"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderTop: 'none',
        }}
      >
        <EditorContent editor={editor} />
        {!content && placeholder && (
          <p className="absolute top-4 left-4 pointer-events-none text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {placeholder}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {uploadError && (
        <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{uploadError}</p>
      )}
    </div>
  );
}
