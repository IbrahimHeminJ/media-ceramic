/**
 * Tiles Catalog Data
 *
 * Designed to easily transition to a backend API response.
 * Each tile entity includes:
 * - id, name, brand, size, color, type, badge, description, specs
 * - image: Main tile swatch image URL
 * - orientations: Up to 4 pattern orientation images with names
 * - pdfUrl: Optional URL to specification sheet / brochure PDF
 * - mockupSeeds: Mockup images for installation views
 */
export const tilesData = [
  {
    id: 1,
    name: 'Carrara Elegance',
    brand: 'Marazzi',
    size: '60x60',
    color: 'white',
    type: 'porcelain',
    badge: 'featured',
    description: 'Inspired by the timeless beauty of Carrara marble, this porcelain tile features soft gray veining on a warm white background. Perfect for bathrooms, kitchens, and living areas seeking a touch of Italian elegance.',
    specs: { thickness: '9mm', finish: 'Matte', slipResistance: 'R10', usage: 'Floor & Wall' },
    image: 'https://picsum.photos/seed/carrara-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Straight Lay', image: 'https://picsum.photos/seed/carrara-straight/500/500' },
      { name: 'Diagonal 45°', image: 'https://picsum.photos/seed/carrara-diagonal/500/500' },
      { name: 'Herringbone', image: 'https://picsum.photos/seed/carrara-herringbone/500/500' },
      { name: 'Offset Stagger', image: 'https://picsum.photos/seed/carrara-offset/500/500' },
    ],
    colors: ['#f5f2ed', '#ece6db', '#e0d8cc', '#d4c9b8'],
    mockupSeeds: ['carrara-room', 'carrara-bath', 'carrara-kitchen', 'carrara-detail']
  },
  {
    id: 2,
    name: 'Terracotta Rustic',
    brand: 'Terra Tile Co.',
    size: '30x30',
    color: 'terracotta',
    type: 'ceramic',
    badge: 'popular',
    description: 'Hand-finished ceramic tiles with a rich, warm terracotta hue. Each piece carries subtle texture variations that add depth and character. Ideal for Mediterranean-inspired kitchens and sun-drenched patios.',
    specs: { thickness: '10mm', finish: 'Natural', slipResistance: 'R11', usage: 'Floor' },
    image: 'https://picsum.photos/seed/terracotta-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Classic Grid', image: 'https://picsum.photos/seed/terracotta-grid/500/500' },
      { name: 'Basketweave', image: 'https://picsum.photos/seed/terracotta-basket/500/500' },
      { name: 'Diagonal 45°', image: 'https://picsum.photos/seed/terracotta-diagonal/500/500' },
      { name: 'Pinwheel', image: 'https://picsum.photos/seed/terracotta-pinwheel/500/500' },
    ],
    colors: ['#c2784a', '#b5693d', '#d4956a', '#a85d32'],
    mockupSeeds: ['terracotta-patio', 'terracotta-kitchen', 'terracotta-room', 'terracotta-detail']
  },
  {
    id: 3,
    name: 'Sandstone Veil',
    brand: 'Florim',
    size: '30x60',
    color: 'beige',
    type: 'porcelain',
    badge: 'new',
    description: 'A subtle sandstone-effect porcelain tile with delicate grain lines and a soft beige palette. Brings a calming, organic feel to contemporary interiors.',
    specs: { thickness: '8mm', finish: 'Satin', slipResistance: 'R10', usage: 'Floor & Wall' },
    image: 'https://picsum.photos/seed/sandstone-swatch-main/800/800',
    pdfUrl: null, // No PDF available for conditional test
    orientations: [
      { name: 'Horizontal Stack', image: 'https://picsum.photos/seed/sandstone-stack/500/500' },
      { name: 'Vertical Stack', image: 'https://picsum.photos/seed/sandstone-vstack/500/500' },
      { name: '1/3 Running Bond', image: 'https://picsum.photos/seed/sandstone-running/500/500' },
      { name: 'Herringbone', image: 'https://picsum.photos/seed/sandstone-herring/500/500' },
    ],
    colors: ['#e8d5c4', '#dcc8b0', '#f0e0d0', '#c9b898'],
    mockupSeeds: ['sandstone-living', 'sandstone-bath', 'sandstone-hall', 'sandstone-detail']
  },
  {
    id: 4,
    name: 'Graphite Slate',
    brand: 'Casalgrande',
    size: '60x60',
    color: 'gray',
    type: 'porcelain',
    badge: null,
    description: 'Dark slate-look porcelain with authentic cleft texture. The deep charcoal tones create striking contrast in modern minimalist spaces.',
    specs: { thickness: '10mm', finish: 'Structured', slipResistance: 'R12', usage: 'Floor' },
    image: 'https://picsum.photos/seed/graphite-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Straight Lay', image: 'https://picsum.photos/seed/graphite-straight/500/500' },
      { name: 'Diagonal Lay', image: 'https://picsum.photos/seed/graphite-diagonal/500/500' },
      { name: 'Offset Grid', image: 'https://picsum.photos/seed/graphite-offset/500/500' },
    ],
    colors: ['#5c554d', '#4a433c', '#6e6559', '#3d3731'],
    mockupSeeds: ['slate-floor', 'slate-entry', 'slate-modern', 'slate-detail']
  },
  {
    id: 5,
    name: 'Marble Calacatta',
    brand: 'Marazzi',
    size: '60x60',
    color: 'white',
    type: 'marble',
    badge: 'featured',
    description: 'Genuine Calacatta marble with bold, dramatic veining. Each slab is unique — a true statement piece for luxury bathrooms and feature walls.',
    specs: { thickness: '12mm', finish: 'Polished', slipResistance: 'R9', usage: 'Wall & Feature' },
    image: 'https://picsum.photos/seed/calacatta-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Bookmatched Look', image: 'https://picsum.photos/seed/calacatta-bookmatch/500/500' },
      { name: 'Straight Lay', image: 'https://picsum.photos/seed/calacatta-straight/500/500' },
      { name: 'Diagonal 45°', image: 'https://picsum.photos/seed/calacatta-diagonal/500/500' },
      { name: 'Diamond Lay', image: 'https://picsum.photos/seed/calacatta-diamond/500/500' },
    ],
    colors: ['#fafaf8', '#f0ede6', '#e8e0d4', '#dcd4c6'],
    mockupSeeds: ['calacatta-bath', 'calacatta-wall', 'calacatta-luxury', 'calacatta-detail']
  },
  {
    id: 6,
    name: 'Terrazzo Fleck',
    brand: 'Terra Tile Co.',
    size: '60x60',
    color: 'beige',
    type: 'terrazzo',
    badge: 'popular',
    description: 'A modern take on classic terrazzo, featuring warm beige base with scattered chips of marble, glass, and mother-of-pearl. Playful yet sophisticated.',
    specs: { thickness: '10mm', finish: 'Honed', slipResistance: 'R10', usage: 'Floor & Wall' },
    image: 'https://picsum.photos/seed/terrazzo-swatch-main/800/800',
    pdfUrl: null, // No PDF
    orientations: [
      { name: 'Seamless Straight', image: 'https://picsum.photos/seed/terrazzo-straight/500/500' },
      { name: 'Diagonal Lay', image: 'https://picsum.photos/seed/terrazzo-diagonal/500/500' },
      { name: 'Randomised Mix', image: 'https://picsum.photos/seed/terrazzo-random/500/500' },
    ],
    colors: ['#ede0d3', '#e5d5c4', '#f2e8db', '#d9c8b4'],
    mockupSeeds: ['terrazzo-living', 'terrazzo-cafe', 'terrazzo-entry', 'terrazzo-detail']
  },
  {
    id: 7,
    name: 'Oakwood Plank',
    brand: 'Florim',
    size: '20x120',
    color: 'brown',
    type: 'porcelain',
    badge: 'new',
    description: 'Wood-effect porcelain planks that capture the warmth of oak grain without the maintenance. Long 120cm format creates seamless, expansive floors.',
    specs: { thickness: '8mm', finish: 'Wood-textured', slipResistance: 'R11', usage: 'Floor' },
    image: 'https://picsum.photos/seed/oakwood-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Staggered Plank', image: 'https://picsum.photos/seed/oakwood-stagger/500/500' },
      { name: 'Herringbone 90°', image: 'https://picsum.photos/seed/oakwood-herringbone/500/500' },
      { name: 'Chevron 45°', image: 'https://picsum.photos/seed/oakwood-chevron/500/500' },
      { name: 'Double Basket', image: 'https://picsum.photos/seed/oakwood-basket/500/500' },
    ],
    colors: ['#b8957a', '#a6846a', '#c4a58c', '#96755c'],
    mockupSeeds: ['oak-floor', 'oak-bedroom', 'oak-hall', 'oak-detail']
  },
  {
    id: 8,
    name: 'Cotto Toscano',
    brand: 'Terra Tile Co.',
    size: '30x30',
    color: 'terracotta',
    type: 'ceramic',
    badge: null,
    description: 'Traditional Tuscan-style cotto tiles with a sun-baked finish. The irregular edges and warm glow bring authentic Italian countryside charm indoors.',
    specs: { thickness: '11mm', finish: 'Rustic', slipResistance: 'R12', usage: 'Floor & Outdoor' },
    image: 'https://picsum.photos/seed/cotto-swatch-main/800/800',
    pdfUrl: null, // No PDF
    orientations: [
      { name: 'Square Grid', image: 'https://picsum.photos/seed/cotto-grid/500/500' },
      { name: 'Diagonal 45°', image: 'https://picsum.photos/seed/cotto-diagonal/500/500' },
      { name: 'Staggered Joint', image: 'https://picsum.photos/seed/cotto-stagger/500/500' },
    ],
    colors: ['#d4895a', '#c97a4d', '#e09a6c', '#b8683a'],
    mockupSeeds: ['cotto-kitchen', 'cotto-terrace', 'cotto-dining', 'cotto-detail']
  },
  {
    id: 9,
    name: 'Pearl Mosaic',
    brand: 'Casalgrande',
    size: '30x30',
    color: 'white',
    type: 'ceramic',
    badge: 'new',
    description: 'Iridescent pearl-finish mosaic tiles on mesh backing. The subtle shimmer catches light beautifully, perfect for kitchen backsplashes and bathroom accents.',
    specs: { thickness: '6mm', finish: 'Glossy', slipResistance: 'R9', usage: 'Wall' },
    image: 'https://picsum.photos/seed/pearl-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Mesh Sheet Grid', image: 'https://picsum.photos/seed/pearl-grid/500/500' },
      { name: 'Offset Mosaic', image: 'https://picsum.photos/seed/pearl-offset/500/500' },
    ],
    colors: ['#fafaf7', '#f3f0ea', '#ebe5db', '#e0d9cc'],
    mockupSeeds: ['pearl-backsplash', 'pearl-bath', 'pearl-accent', 'pearl-detail']
  },
  {
    id: 10,
    name: 'Basalt Midnight',
    brand: 'Florim',
    size: '60x60',
    color: 'gray',
    type: 'porcelain',
    badge: null,
    description: 'Deep volcanic basalt-inspired porcelain with a velvety matte surface. The near-black tones anchor spaces with quiet drama and sophistication.',
    specs: { thickness: '9mm', finish: 'Velvet Matte', slipResistance: 'R11', usage: 'Floor & Wall' },
    image: 'https://picsum.photos/seed/basalt-swatch-main/800/800',
    pdfUrl: null, // No PDF
    orientations: [
      { name: 'Monolithic Grid', image: 'https://picsum.photos/seed/basalt-grid/500/500' },
      { name: 'Diagonal 45°', image: 'https://picsum.photos/seed/basalt-diagonal/500/500' },
      { name: 'Offset Bond', image: 'https://picsum.photos/seed/basalt-offset/500/500' },
    ],
    colors: ['#3a3530', '#2d2925', '#4a4440', '#1f1c19'],
    mockupSeeds: ['basalt-bath', 'basalt-living', 'basalt-modern', 'basalt-detail']
  },
  {
    id: 11,
    name: 'Limestone Dune',
    brand: 'Terra Tile Co.',
    size: '30x60',
    color: 'beige',
    type: 'ceramic',
    badge: 'popular',
    description: 'Soft limestone-effect ceramic with fossil-like impressions. The warm dune tones evoke windswept coastal landscapes and serene desert vistas.',
    specs: { thickness: '9mm', finish: 'Honed', slipResistance: 'R10', usage: 'Floor & Wall' },
    image: 'https://picsum.photos/seed/limestone-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Brick Bond (1/2)', image: 'https://picsum.photos/seed/limestone-brick/500/500' },
      { name: 'Stack Bond', image: 'https://picsum.photos/seed/limestone-stack/500/500' },
      { name: 'Vertical Stack', image: 'https://picsum.photos/seed/limestone-vertical/500/500' },
      { name: 'Herringbone', image: 'https://picsum.photos/seed/limestone-herringbone/500/500' },
    ],
    colors: ['#e5d8c8', '#dcccb8', '#efe4d4', '#cfbfa8'],
    mockupSeeds: ['limestone-bath', 'limestone-spa', 'limestone-hall', 'limestone-detail']
  },
  {
    id: 12,
    name: 'Herringbone Brick',
    brand: 'Marazzi',
    size: '30x60',
    color: 'brown',
    type: 'porcelain',
    badge: 'featured',
    description: 'Brick-format porcelain designed for herringbone and chevron patterns. The toasted brown glaze adds warmth and old-world charm to any wall.',
    specs: { thickness: '8mm', finish: 'Semi-gloss', slipResistance: 'R9', usage: 'Wall' },
    image: 'https://picsum.photos/seed/brick-swatch-main/800/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    orientations: [
      { name: 'Classic Herringbone', image: 'https://picsum.photos/seed/brick-herringbone/500/500' },
      { name: 'Running Brick', image: 'https://picsum.photos/seed/brick-running/500/500' },
      { name: 'Double Herringbone', image: 'https://picsum.photos/seed/brick-double-herring/500/500' },
      { name: 'Diagonal Chevron', image: 'https://picsum.photos/seed/brick-chevron/500/500' },
    ],
    colors: ['#b08a6c', '#a07a5c', '#c09a7c', '#8c6648'],
    mockupSeeds: ['brick-wall', 'brick-kitchen', 'brick-fireplace', 'brick-detail']
  }
];
