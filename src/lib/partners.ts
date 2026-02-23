// Partners data library — DB-backed with in-memory fallback
// Public functions only return partners where status = 'published'

import { getDb } from './db';
import { partners as partnersTable } from './schema';
import { eq, and, desc } from 'drizzle-orm';

export interface Partner {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  industry: string;
  services: string[];
  website: string;
  founded: string;
  headquarters: string;
  employees: string;
  partnershipType: 'strategic' | 'technology' | 'media' | 'consulting';
  partnerSince: string;
  featured: boolean;
  collaborationAreas: string[];
  keyHighlights: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// ========================
// In-memory fallback data (abbreviated)
// ========================
const fallbackPartners: Partner[] = [
  {
    id: 'p1',
    slug: 'gulf-capital-advisors',
    name: 'Gulf Capital Advisors',
    description: 'Leading investment advisory firm specializing in MENA markets, private equity, and cross-border M&A transactions.',
    longDescription: '<p>Gulf Capital Advisors is a premier investment advisory firm headquartered in Dubai.</p>',
    industry: 'Financial Services',
    services: ['Private Equity Advisory', 'M&A Advisory', 'Capital Markets', 'Family Office Services'],
    website: 'https://gulfcapitaladvisors.ae',
    founded: '2009',
    headquarters: 'Dubai, UAE',
    employees: '120+',
    partnershipType: 'strategic',
    partnerSince: '2024',
    featured: true,
    collaborationAreas: ['Joint Research Reports', 'Co-hosted Events', 'Exclusive Content Series'],
    keyHighlights: ['$2.5B+ Assets Under Advisory', '45+ Completed Transactions', 'Presence in 6 GCC Markets'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/gulf-capital-advisors',
      twitter: 'https://twitter.com/gulfcapadvisors',
    },
  },
  {
    id: 'p2',
    slug: 'nexatech-solutions',
    name: 'NexaTech Solutions',
    description: 'Enterprise technology partner delivering AI-powered business intelligence and digital transformation solutions across the region.',
    longDescription: '<p>NexaTech Solutions is a regional technology leader providing cutting-edge AI and machine learning solutions.</p>',
    industry: 'Technology',
    services: ['AI & Machine Learning', 'Business Intelligence', 'Cloud Infrastructure', 'Digital Transformation'],
    website: 'https://nexatech.ae',
    founded: '2017',
    headquarters: 'Abu Dhabi, UAE',
    employees: '300+',
    partnershipType: 'technology',
    partnerSince: '2024',
    featured: true,
    collaborationAreas: ['Platform Technology', 'AI Content Engine', 'Joint Tech Workshops'],
    keyHighlights: ['500+ Enterprise Clients', 'AWS Advanced Partner', 'Regional AI Innovation Award 2025'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/nexatech-solutions',
      twitter: 'https://twitter.com/nexatechae',
    },
  },
];

// ========================
// DB row → Partner mapper
// ========================
type DbPartner = typeof partnersTable.$inferSelect;

function mapDbToPartner(row: DbPartner): Partner {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.longDescription || '',
    industry: row.industry,
    services: (row.services as string[]) || [],
    website: row.website || '',
    founded: row.founded || '',
    headquarters: row.headquarters || '',
    employees: row.employees || '',
    partnershipType: (row.partnershipType as Partner['partnershipType']) || 'strategic',
    partnerSince: row.partnerSince || '',
    featured: row.featured,
    collaborationAreas: (row.collaborationAreas as string[]) || [],
    keyHighlights: (row.keyHighlights as string[]) || [],
    socialLinks: (row.socialLinks as Partner['socialLinks']) || {},
  };
}

// ========================
// Public query functions (only published partners)
// ========================

export async function getAllPartners(): Promise<Partner[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(partnersTable)
      .where(eq(partnersTable.status, 'published'))
      .orderBy(desc(partnersTable.featured), partnersTable.name);
    if (rows.length === 0) return sortPartners([...fallbackPartners]);
    return sortPartners(rows.map(mapDbToPartner));
  } catch {
    return sortPartners([...fallbackPartners]);
  }
}

export async function getPartnerBySlug(slug: string): Promise<Partner | undefined> {
  try {
    const db = getDb();
    const rows = await db.select().from(partnersTable)
      .where(and(eq(partnersTable.slug, slug), eq(partnersTable.status, 'published')));
    if (rows.length === 0) return fallbackPartners.find(p => p.slug === slug);
    return mapDbToPartner(rows[0]);
  } catch {
    return fallbackPartners.find(p => p.slug === slug);
  }
}

export async function getFeaturedPartners(): Promise<Partner[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(partnersTable)
      .where(and(eq(partnersTable.status, 'published'), eq(partnersTable.featured, true)));
    if (rows.length === 0) return fallbackPartners.filter(p => p.featured);
    return rows.map(mapDbToPartner);
  } catch {
    return fallbackPartners.filter(p => p.featured);
  }
}

export async function getPartnersByType(type: string): Promise<Partner[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(partnersTable)
      .where(and(eq(partnersTable.status, 'published'), eq(partnersTable.partnershipType, type)));
    if (rows.length === 0) return fallbackPartners.filter(p => p.partnershipType === type);
    return rows.map(mapDbToPartner);
  } catch {
    return fallbackPartners.filter(p => p.partnershipType === type);
  }
}

export function getPartnershipTypes(): string[] {
  return ['strategic', 'technology', 'media', 'consulting'];
}

export async function getRelatedPartners(currentSlug: string, limit: number = 3): Promise<Partner[]> {
  try {
    const all = await getAllPartners();
    const current = all.find(p => p.slug === currentSlug);
    if (!current) return [];
    const others = all.filter(p => p.slug !== currentSlug);
    const sameType = others.filter(p => p.partnershipType === current.partnershipType);
    const different = others.filter(p => p.partnershipType !== current.partnershipType);
    return [...sameType, ...different].slice(0, limit);
  } catch {
    return [];
  }
}

// Sort: featured first, then alphabetical
function sortPartners(partners: Partner[]): Partner[] {
  return [...partners].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}
