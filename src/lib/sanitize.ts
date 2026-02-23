import DOMPurify from 'isomorphic-dompurify';

// Only allow iframes from trusted video providers
const ALLOWED_IFRAME_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
];

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows common formatting tags, inline images, and video iframes
 * from trusted providers (YouTube, Vimeo) while stripping dangerous elements.
 */
export function sanitizeHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'em', 'b', 'i', 'u', 's', 'del',
      'a', 'img', 'iframe',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'figure', 'figcaption',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'id',
      'frameborder', 'allow', 'allowfullscreen', 'title',
      'style',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_URI_SAFE_ATTR: ['src'],
  });

  // Post-process: strip iframes that don't point to allowed hosts
  return clean.replace(/<iframe[^>]*src="([^"]*)"[^>]*>[\s\S]*?<\/iframe>/gi, (match, src) => {
    try {
      const url = new URL(src);
      if (ALLOWED_IFRAME_HOSTS.includes(url.hostname)) {
        return match;
      }
    } catch {
      // invalid URL
    }
    return ''; // strip non-allowed iframes
  });
}
