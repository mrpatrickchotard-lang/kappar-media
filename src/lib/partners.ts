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

const partners: Partner[] = [
  {
    id: 'p1',
    slug: 'gulf-capital-advisors',
    name: 'Gulf Capital Advisors',
    description: 'Leading investment advisory firm specializing in MENA markets, private equity, and cross-border M&A transactions.',
    longDescription: `<p>Gulf Capital Advisors is a premier investment advisory firm headquartered in Dubai, serving institutional investors and family offices across the GCC region. With over $2.5 billion in assets under advisory, the firm provides strategic counsel on private equity, venture capital, and cross-border M&A transactions.</p>
<p>Our partnership with Gulf Capital Advisors enables Kappar to deliver exclusive insights into regional investment trends, market analysis, and thought leadership content from some of the most respected voices in MENA finance.</p>
<p>Through joint research initiatives and co-hosted events, we bring our audience unparalleled access to the strategies shaping the future of capital markets in the Middle East.</p>`,
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
    longDescription: `<p>NexaTech Solutions is a regional technology leader providing cutting-edge AI and machine learning solutions to enterprises across the Middle East and North Africa. Founded in Abu Dhabi, the company has rapidly grown to become one of the most innovative tech firms in the GCC.</p>
<p>As Kappar's technology partner, NexaTech powers our data analytics infrastructure and provides the AI-driven content recommendation engine that personalizes the reader experience on our platform.</p>
<p>Together, we explore the intersection of technology and media, co-producing technical deep-dives, hosting workshops on AI adoption, and showcasing how businesses can leverage emerging technologies for competitive advantage.</p>`,
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
  {
    id: 'p3',
    slug: 'arabian-media-group',
    name: 'Arabian Media Group',
    description: 'Premier media conglomerate operating across print, digital, and broadcast channels with reach across 12 MENA markets.',
    longDescription: `<p>Arabian Media Group (AMG) is one of the largest independent media companies in the Middle East, operating a diverse portfolio of print publications, digital platforms, and broadcast channels. With editorial offices in Dubai, Riyadh, Cairo, and Casablanca, AMG reaches over 25 million readers and viewers monthly.</p>
<p>Our media partnership with AMG amplifies Kappar's reach across the broader MENA region, enabling content syndication, co-branded editorial series, and shared distribution channels that bring our insights to decision-makers in markets we couldn't reach alone.</p>
<p>This partnership represents a strategic alignment of two forward-thinking media organizations committed to elevating the quality of business journalism in the region.</p>`,
    industry: 'Media & Publishing',
    services: ['Content Syndication', 'Brand Partnerships', 'Event Production', 'Digital Advertising'],
    website: 'https://arabianmediagroup.com',
    founded: '2005',
    headquarters: 'Dubai, UAE',
    employees: '800+',
    partnershipType: 'media',
    partnerSince: '2025',
    featured: true,
    collaborationAreas: ['Content Syndication', 'Co-branded Series', 'Cross-platform Distribution'],
    keyHighlights: ['25M+ Monthly Reach', '12 MENA Markets', '15+ Media Properties'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/arabian-media-group',
      twitter: 'https://twitter.com/arabianmediagrp',
    },
  },
  {
    id: 'p4',
    slug: 'meridian-consulting',
    name: 'Meridian Consulting',
    description: 'Management consulting firm helping C-suite leaders navigate digital disruption, organizational change, and market expansion.',
    longDescription: `<p>Meridian Consulting is a boutique management consulting firm renowned for its deep expertise in digital strategy, organizational transformation, and market entry advisory. With a client roster that includes Fortune 500 companies and leading regional enterprises, Meridian brings world-class strategic thinking to the MENA business landscape.</p>
<p>As Kappar's consulting partner, Meridian provides expert-driven content, contributes to our thought leadership programs, and co-develops executive education initiatives that serve our audience of business leaders and decision-makers.</p>
<p>Their team of seasoned consultants regularly contributes analysis and commentary to Kappar, ensuring our readers benefit from battle-tested strategic perspectives on the most pressing business challenges of our time.</p>`,
    industry: 'Management Consulting',
    services: ['Digital Strategy', 'Organizational Transformation', 'Market Entry', 'Executive Advisory'],
    website: 'https://meridianconsulting.com',
    founded: '2012',
    headquarters: 'Riyadh, Saudi Arabia',
    employees: '200+',
    partnershipType: 'consulting',
    partnerSince: '2025',
    featured: false,
    collaborationAreas: ['Expert Content', 'Executive Programs', 'Strategy Insights'],
    keyHighlights: ['150+ Enterprise Clients', 'Offices in 4 Countries', 'Top 10 MENA Consulting Firm'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/meridian-consulting',
    },
  },
  {
    id: 'p5',
    slug: 'sahara-ventures',
    name: 'Sahara Ventures',
    description: 'Early-stage venture capital fund backing transformative startups in fintech, healthtech, and cleantech across emerging markets.',
    longDescription: `<p>Sahara Ventures is an early-stage venture capital fund with a focus on transformative startups operating at the intersection of technology and impact. With over $180 million in committed capital, the fund has backed more than 40 startups across fintech, healthtech, and cleantech in MENA and broader emerging markets.</p>
<p>Our partnership with Sahara Ventures gives Kappar exclusive access to the region's most promising startup ecosystem. Through co-hosted pitch events, founder spotlights, and deep-dive features on portfolio companies, we bring our audience front-row seats to innovation in action.</p>
<p>Sahara Ventures' investment thesis and portfolio insights are regularly featured in Kappar's content, providing our readers with a unique window into where smart money is flowing and which trends are shaping the future of business in emerging markets.</p>`,
    industry: 'Venture Capital',
    services: ['Seed & Series A Investment', 'Portfolio Support', 'Startup Ecosystem Building', 'Impact Investing'],
    website: 'https://saharaventures.com',
    founded: '2019',
    headquarters: 'Dubai, UAE',
    employees: '35+',
    partnershipType: 'strategic',
    partnerSince: '2025',
    featured: false,
    collaborationAreas: ['Startup Features', 'Co-hosted Pitch Events', 'Ecosystem Reports'],
    keyHighlights: ['$180M+ Committed Capital', '40+ Portfolio Companies', '3 Unicorn Exits'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/sahara-ventures',
      twitter: 'https://twitter.com/saharavc',
    },
  },
  {
    id: 'p6',
    slug: 'oasis-property-group',
    name: 'Oasis Property Group',
    description: 'Full-service real estate development and investment firm behind some of the most iconic projects in the Gulf region.',
    longDescription: `<p>Oasis Property Group is a leading real estate development and investment company with a portfolio spanning luxury residential towers, mixed-use developments, and commercial complexes across the UAE, Saudi Arabia, and Bahrain. The group has delivered over $4 billion in completed projects.</p>
<p>Kappar's partnership with Oasis Property Group strengthens our coverage of the real estate sector — one of the most dynamic industries in the MENA region. Through exclusive interviews, project features, and market analysis, we provide our audience with insider perspectives on the forces shaping the built environment.</p>
<p>Together, we co-produce the quarterly "MENA Real Estate Outlook" report, which has become a must-read resource for investors, developers, and policymakers in the region's property sector.</p>`,
    industry: 'Real Estate',
    services: ['Property Development', 'Investment Management', 'Asset Management', 'Property Consulting'],
    website: 'https://oasispropertygroup.ae',
    founded: '2008',
    headquarters: 'Dubai, UAE',
    employees: '500+',
    partnershipType: 'strategic',
    partnerSince: '2024',
    featured: false,
    collaborationAreas: ['Quarterly Reports', 'Exclusive Interviews', 'Market Analysis'],
    keyHighlights: ['$4B+ Delivered Projects', '15+ Iconic Developments', 'Presence in 3 GCC Markets'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/oasis-property-group',
    },
  },
  {
    id: 'p7',
    slug: 'zenith-digital-agency',
    name: 'Zenith Digital Agency',
    description: 'Award-winning digital marketing agency specializing in performance marketing, brand strategy, and content creation for the MENA market.',
    longDescription: `<p>Zenith Digital Agency is an award-winning digital marketing firm that has helped over 200 brands grow their presence across MENA's rapidly evolving digital landscape. From performance marketing and SEO to creative brand strategy and content production, Zenith delivers measurable results for clients ranging from ambitious startups to established enterprises.</p>
<p>As Kappar's media partner, Zenith collaborates on our marketing-focused content vertical, bringing practitioner insights and case studies that resonate with our audience of marketing professionals and business leaders. Their team contributes regular analysis of digital trends, platform updates, and best practices.</p>
<p>This partnership also extends to our events program, where Zenith co-produces our marketing masterclass series and provides hands-on workshops that give attendees actionable strategies they can implement immediately.</p>`,
    industry: 'Digital Marketing',
    services: ['Performance Marketing', 'Brand Strategy', 'Content Production', 'SEO & Analytics'],
    website: 'https://zenithdigital.ae',
    founded: '2015',
    headquarters: 'Dubai, UAE',
    employees: '150+',
    partnershipType: 'media',
    partnerSince: '2025',
    featured: false,
    collaborationAreas: ['Marketing Content', 'Workshop Co-production', 'Case Studies'],
    keyHighlights: ['200+ Brand Clients', 'MENA Digital Agency of the Year 2025', '$50M+ Ad Spend Managed'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/zenith-digital-agency',
      twitter: 'https://twitter.com/zenithdigitalae',
    },
  },
];

// Helper functions
export function getAllPartners(): Partner[] {
  // Featured first, then alphabetical
  return [...partners].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find(p => p.slug === slug);
}

export function getFeaturedPartners(): Partner[] {
  return partners.filter(p => p.featured);
}

export function getPartnersByType(type: string): Partner[] {
  return partners.filter(p => p.partnershipType === type);
}

export function getPartnershipTypes(): string[] {
  return ['strategic', 'technology', 'media', 'consulting'];
}

export function getRelatedPartners(currentSlug: string, limit: number = 3): Partner[] {
  const current = getPartnerBySlug(currentSlug);
  if (!current) return [];

  // Same type first, then others, excluding current
  const others = partners.filter(p => p.slug !== currentSlug);
  const sameType = others.filter(p => p.partnershipType === current.partnershipType);
  const different = others.filter(p => p.partnershipType !== current.partnershipType);

  return [...sameType, ...different].slice(0, limit);
}
