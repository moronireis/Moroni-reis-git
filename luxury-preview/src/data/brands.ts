// Brand DNA data — extracted from tokens.json and DESIGN.md files in
// brain/design-library/references/{brand}/
// Do NOT edit manually — source of truth is the reference files.

export type BrandVertical =
  | 'fashion'
  | 'automotive'
  | 'hospitality'
  | 'beauty'
  | 'fragrance'
  | 'jewelry';

export type QualityGrade = 'A' | 'B' | 'C';

export interface BrandMetrics {
  buttonRadius: string;
  cardRadius: string;
  defaultTransitionDuration: string;
  heroFontSize: string;
}

export interface BrandEntry {
  slug: string;
  name: string;
  vertical: BrandVertical;
  palette: string[];          // hex colors, primary first
  accentColor: string;        // signature brand color (may equal palette[0])
  displayFont: string;        // human-readable font name
  bodyFont: string;
  signatureStyle: string;     // 1–2 sentence summary
  grade: QualityGrade;
  metrics: BrandMetrics;
  hasPreview: boolean;        // preview.html exists
  hasFullExtraction: boolean; // inputs/ directory exists
}

export const brands: BrandEntry[] = [
  {
    slug: 'chanel',
    name: 'CHANEL',
    vertical: 'fashion',
    palette: ['#000000', '#1d1d1d', '#333333', '#767676', '#ffffff', '#d8d8d8'],
    accentColor: '#000000',
    displayFont: 'ABChanel 2022',
    bodyFont: 'ABChanel Corpo',
    signatureStyle:
      'Absolute monochrome discipline — black on white, zero border-radius on every interactive surface. Ultra-light weight 200 display type at 3.6rem communicates power through restraint.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.2s',
      heroFontSize: '3.625rem',
    },
    hasPreview: true,
    hasFullExtraction: true,
  },
  {
    slug: 'hermes',
    name: 'Hermès',
    vertical: 'fashion',
    palette: ['#f6811e', '#000000', '#f6f1eb', '#fcf7f1', '#696969', '#cbcbcb'],
    accentColor: '#f6811e',
    displayFont: 'EB Garamond',
    bodyFont: 'Manrope',
    signatureStyle:
      'Warm parchment surfaces with a bold orange accent that signals craft and warmth. Garamond display headlines paired with Overpass Mono for metadata creates the High-Low tension central to the brand\'s editorial voice.',
    grade: 'C',
    metrics: {
      buttonRadius: '4px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.4s',
      heroFontSize: '2.125rem',
    },
    hasPreview: true,
    hasFullExtraction: true,
  },
  {
    slug: 'tiffany',
    name: 'Tiffany & Co.',
    vertical: 'jewelry',
    palette: ['#81d8d0', '#000000', '#002b49', '#0c3d5d', '#e6e6e6', '#ffffff'],
    accentColor: '#81d8d0',
    displayFont: 'Sterling Display',
    bodyFont: 'Santral',
    signatureStyle:
      'The iconic Tiffany Blue (#81D8D0) dominates the navigation bar and CTA hover states while the rest of the system stays strictly monochrome. Zero border-radius throughout; sterling display serif at 42px anchors the editorial hierarchy.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.5s',
      heroFontSize: '42px',
    },
    hasPreview: true,
    hasFullExtraction: true,
  },
  {
    slug: 'dior',
    name: 'Dior',
    vertical: 'fashion',
    palette: ['#000000', '#ffffff', '#757575', '#E8E8E8', '#F5F5F0', '#FAF8F5'],
    accentColor: '#C4A35A',
    displayFont: 'Dior (custom serif)',
    bodyFont: 'Helvetica Neue',
    signatureStyle:
      'Pure black-and-white foundation with a gold accent (#C4A35A) reserved for brand marks and select editorial moments. Hero type at 72px with tight tracking (-0.02em); section padding at 160px enforces maximum negative space.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.6s',
      heroFontSize: '72px',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
  {
    slug: 'cartier',
    name: 'Cartier',
    vertical: 'jewelry',
    palette: ['#000000', '#ffffff', '#A5182A', '#6B0F1A', '#FAF7F2', '#F5F0E8'],
    accentColor: '#A5182A',
    displayFont: 'Cartier (custom serif)',
    bodyFont: 'CartierSans',
    signatureStyle:
      'Warm-cream surfaces (#FAF7F2) anchor a system where Cartier Red (#A5182A) appears sparingly as a brand signal. Display serif at 64px with ultra-wide letter-spacing (0.2em) on metadata; reveal transitions at 0.7s with dramatic deceleration.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.35s',
      heroFontSize: '64px',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
  {
    slug: 'louisvuitton',
    name: 'Louis Vuitton',
    vertical: 'fashion',
    palette: ['#000000', '#ffffff', '#6B4226', '#C19A6B', '#F9F6F1', '#F2EDE7'],
    accentColor: '#6B4226',
    displayFont: 'LouisVuitton (custom serif)',
    bodyFont: 'LVBody / Neue Helvetica',
    signatureStyle:
      'Warm off-white backgrounds (#F9F6F1) with LV Brown as the sole brand accent signal heritage and craft. Hero type at 80px with tight -0.03em tracking; video cross-fade transitions at 1.5s demonstrate the brand\'s cinematic pace.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.4s',
      heroFontSize: '80px',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
  {
    slug: 'bottegaveneta',
    name: 'Bottega Veneta',
    vertical: 'fashion',
    palette: ['#000000', '#272727', '#009539', '#767676', '#f1f3f2', '#d8d8d8'],
    accentColor: '#009539',
    displayFont: 'Bottega Veneta (custom serif)',
    bodyFont: 'Bottega Veneta Bold',
    signatureStyle:
      'An unexpected Bottega Green (#009539) cuts through a strict monochrome system as the brand\'s single accent — appearing on success states, hover treatments, and selection indicators. Full-serif type stack at every level; zero border-radius throughout.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.2s',
      heroFontSize: '3.5625rem',
    },
    hasPreview: true,
    hasFullExtraction: true,
  },
  {
    slug: 'brunellocucinelli',
    name: 'Brunello Cucinelli',
    vertical: 'fashion',
    palette: ['#262626', '#8d8277', '#71685f', '#939494', '#f1f0ef', '#f5f5f5'],
    accentColor: '#8d8277',
    displayFont: 'IvyPresto',
    bodyFont: 'GT Eesti',
    signatureStyle:
      'A warm earthy palette of cashmere grays and parchment tones reflects the brand\'s Umbrian craft philosophy. IvyPresto at 7rem with weight 300 creates the most generous display scale in the library; all interactions use understated text-links over buttons.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.22s',
      heroFontSize: '7rem',
    },
    hasPreview: true,
    hasFullExtraction: true,
  },
  {
    slug: 'aesop',
    name: 'Aesop',
    vertical: 'beauty',
    palette: ['#333D2C', '#000000', '#FFFEF2', '#F6F5E8', '#696158', '#D4CFC4'],
    accentColor: '#333D2C',
    displayFont: 'Suisse Intl',
    bodyFont: 'Suisse Intl',
    signatureStyle:
      'A forest-green and parchment palette anchors one of the most coherent single-typeface systems in luxury: Suisse Intl carries every role from 3.5rem display to 11px captions. Optima reserved exclusively for editorial pull-quotes — a studied, confident restraint.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.4s',
      heroFontSize: '3.5rem',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
  {
    slug: 'diptyque',
    name: 'Diptyque',
    vertical: 'fragrance',
    palette: ['#000000', '#ffffff', '#2D4A3E', '#F5F0E8', '#FAF7F2', '#D4CFC7'],
    accentColor: '#2D4A3E',
    displayFont: 'Diptyque Saint-Germain (custom)',
    bodyFont: 'System sans-serif',
    signatureStyle:
      'A custom proprietary serif (Atelje Altmann, 2022) at 48–64px with wide letter-spacing (0.02–0.05em) carries the brand\'s Parisian botanical voice. Signature dark green (#2D4A3E) appears in seasonal collections; the system avoids drop shadows entirely, using radial-gradient overlays for product glow.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.35s',
      heroFontSize: '64px',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
  {
    slug: 'rolls-royce',
    name: 'Rolls-Royce',
    vertical: 'automotive',
    palette: ['#000000', '#0D0D0D', '#1A1A1A', '#6B2D8B', '#C4A265', '#FFFFFF'],
    accentColor: '#6B2D8B',
    displayFont: 'Riviera Nights',
    bodyFont: 'System sans-serif',
    signatureStyle:
      'The only dark-mode-native brand in the library: anthracite surfaces (#1A1A1A) with Purple Spirit (#6B2D8B) as a signature accent signal nobility. Display text at 80px with 0.15em tracking; "stately" transitions at 1.0s and "cinematic" at 1.5s define the slowest motion palette in the collection.',
    grade: 'B',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.4s',
      heroFontSize: '80px',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
  {
    slug: 'aman',
    name: 'Aman',
    vertical: 'hospitality',
    palette: ['#000000', '#313131', '#585858', '#b38b5b', '#f3eee7', '#dad9d7'],
    accentColor: '#b38b5b',
    displayFont: 'Lyon Display Web',
    bodyFont: 'Whitney SSm',
    signatureStyle:
      'Sand-warm surfaces (#F3EEE7) and a warm tan accent (#B38B5B) define the world\'s most quietly luxurious hospitality brand online. Lyon Display at 5.14rem weight 300 with Whitney SSm for UI creates a classic High-Low pairing; section padding at 120px enforces meditative pace.',
    grade: 'A',
    metrics: {
      buttonRadius: '0px',
      cardRadius: '0px',
      defaultTransitionDuration: '0.2s',
      heroFontSize: '5.1428rem',
    },
    hasPreview: true,
    hasFullExtraction: false,
  },
];

export const verticals: BrandVertical[] = [
  'fashion',
  'jewelry',
  'beauty',
  'fragrance',
  'automotive',
  'hospitality',
];

export function getBrandBySlug(slug: string): BrandEntry | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getBrandsByVertical(vertical: BrandVertical): BrandEntry[] {
  return brands.filter((b) => b.vertical === vertical);
}
