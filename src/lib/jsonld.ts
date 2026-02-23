import type { Article } from '@/lib/content';

const BASE_URL = 'https://kappar.tv';

/**
 * Organization schema for the root layout
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kappar Media',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    description: 'Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.',
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
  };
}

/**
 * WebSite schema with search action
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kappar Media',
    url: BASE_URL,
    description: 'Forward media platform for business leaders',
    publisher: {
      '@type': 'Organization',
      name: 'Kappar Media',
    },
  };
}

/**
 * Article schema for content detail pages
 */
export function articleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kappar Media',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icon.svg`,
      },
    },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/content/${article.slug}`,
    },
    keywords: article.tags.join(', '),
    ...(article.coverImage && {
      image: {
        '@type': 'ImageObject',
        url: article.coverImage,
      },
    }),
  };
}

/**
 * Event schema for event detail pages
 */
export function eventJsonLd(event: {
  title: string;
  description: string;
  slug: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  price: number;
  currency: string;
  status: string;
  capacity?: number;
  registeredCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: `${event.date}T${event.startTime}:00`,
    endDate: `${event.date}T${event.endTime}:00`,
    location: {
      '@type': 'Place',
      name: event.location,
      ...(event.address && {
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.address,
        },
      }),
    },
    organizer: {
      '@type': 'Organization',
      name: 'Kappar Media',
      url: BASE_URL,
    },
    eventStatus: event.status === 'past'
      ? 'https://schema.org/EventPostponed'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: event.currency,
      availability: event.status === 'sold-out'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      url: `${BASE_URL}/events/${event.slug}`,
    },
    ...(event.capacity && {
      maximumAttendeeCapacity: event.capacity,
    }),
    url: `${BASE_URL}/events/${event.slug}`,
  };
}

/**
 * Person schema for expert detail pages
 */
export function expertJsonLd(expert: {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  hourlyRate: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: expert.name,
    jobTitle: expert.title,
    description: expert.bio,
    knowsAbout: expert.expertise,
    url: `${BASE_URL}/experts/${expert.id}`,
    worksFor: {
      '@type': 'Organization',
      name: 'Kappar Media',
    },
  };
}

/**
 * BreadcrumbList schema
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
