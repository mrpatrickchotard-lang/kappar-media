import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Kappar Media. Reach out for partnerships, editorial inquiries, advertising, or general questions.',
  openGraph: {
    title: 'Contact Kappar Media',
    description: 'Get in touch for partnerships, editorial inquiries, or general questions.',
    url: 'https://kappar.tv/contact',
  },
  alternates: {
    canonical: 'https://kappar.tv/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
