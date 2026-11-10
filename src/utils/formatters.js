/**
 * VERDANTA WORLD - UTILITY FORMATTERS
 */

export function formatPrice(val) {
  if (val === undefined || val === null || val === '') return '₹0';
  if (typeof val === 'string' && val.trim().startsWith('₹')) return val;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, '')) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

export function parseNumericPrice(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = String(val).replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
}

export function normalizeCategoryId(catNameOrId, categoriesList = null) {
  if (!catNameOrId) return 'artisan-gallery';
  const clean = String(catNameOrId).toLowerCase().trim();

  // 1. Check against active categories list (or stored categories) first!
  let cats = categoriesList;
  if (!cats && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('verdanta_categories');
      if (stored) cats = JSON.parse(stored);
    } catch (e) {}
  }
  if (Array.isArray(cats)) {
    const matched = cats.find(c =>
      (c.id && c.id.toLowerCase() === clean) ||
      (c.name && c.name.toLowerCase() === clean) ||
      (c.displayName && c.displayName.toLowerCase() === clean)
    );
    if (matched) return matched.id;
  }

  // 2. Exact matches for standard category IDs
  if (clean === 'artisan-gallery') return 'artisan-gallery';
  if (clean === 'wooden-gallery') return 'wooden-gallery';
  if (clean === 'premium-home-decor') return 'premium-home-decor';
  if (clean === 'personalization-gifting') return 'personalization-gifting';
  if (clean === 'corporate-gifting') return 'corporate-gifting';
  if (clean === 'wholesale-wood') return 'wholesale-wood';
  if (clean === 'wholesale-metal') return 'wholesale-metal';
  if (clean === 'export-wood') return 'export-wood';
  if (clean === 'export-metal') return 'export-metal';

  // 3. Exact matches for standard category display names
  if (clean === 'artisan gallery') return 'artisan-gallery';
  if (clean === 'wooden crafts' || clean === 'wooden gallery') return 'wooden-gallery';
  if (clean === 'premium home décor' || clean === 'premium home decor') return 'premium-home-decor';
  if (clean === 'return gifting' || clean === 'personalization gifting' || clean === 'personalization & gifting') return 'personalization-gifting';
  if (clean === 'corporate gifting') return 'corporate-gifting';
  if (clean === 'wholesale wood crafts' || clean === 'wholesale - wood crafts') return 'wholesale-wood';
  if (clean === 'wholesale metal crafts' || clean === 'wholesale - metal crafts') return 'wholesale-metal';
  if (clean === 'export wood crafts' || clean === 'export - wood crafts') return 'export-wood';
  if (clean === 'export metal crafts' || clean === 'export - metal crafts') return 'export-metal';

  // 4. Safe fallback: slugify cleanly without overriding custom category names
  return clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'artisan-gallery';
}

export function normalizeSubCategory(catId, subItem, categoryObj = null) {
  if (!subItem) return 'Featured Creations';
  const clean = String(subItem).trim();

  // If clean matches an existing defined subcategory (case-insensitive), keep it pristine
  if (categoryObj && Array.isArray(categoryObj.subCategories)) {
    const matched = categoryObj.subCategories.find(s => s.toLowerCase() === clean.toLowerCase());
    if (matched) return matched;
  }

  const lower = clean.toLowerCase();

  if (catId === 'artisan-gallery') {
    if (lower.includes('lamp') || lower.includes('light')) return 'Lamps & Ambient Lighting';
    if (lower.includes('terracotta') || lower.includes('clay') || lower.includes('pot') || lower.includes('urn')) return 'Terracotta & Clay Crafts';
    if (lower.includes('woven') || lower.includes('grass') || lower.includes('basket') || lower.includes('sabai') || lower.includes('leaf')) return 'Handwoven';
    if (lower.includes('cane')) return 'Cane crafts';
    if (lower.includes('artisan') || lower.includes('decor') || lower.includes('décor')) return 'Artisan Décor';
  } else if (catId === 'wooden-gallery') {
    if (lower.includes('toy') || lower.includes('bird')) return 'Toys';
    if (lower.includes('key')) return 'Keychains & Mini Gifts';
    if (lower.includes('candle') || lower.includes('light') || lower.includes('tea-light')) return 'Tea-Light Candles';
    if (lower.includes('clock')) return 'Wooden Clocks';
    if (lower.includes('decor') || lower.includes('plaque') || lower.includes('wood') || lower.includes('box')) return 'Wooden Decor';
  } else if (catId === 'premium-home-decor') {
    if (lower.includes('table') || lower.includes('urli') || lower.includes('bowl')) return 'Table Décor';
    if (lower.includes('wall') || lower.includes('hanging') || lower.includes('tapestry')) return 'Wall Décor';
    if (lower.includes('traditional') || lower.includes('heritage') || lower.includes('accessory') || lower.includes('fluted')) return 'Traditional & Heritage Décor';
    if (lower.includes('sculpt') || lower.includes('figurine')) return 'Sculptures & Figurines';
  } else if (catId === 'personalization-gifting') {
    if (lower.includes('anniversary')) return 'Anniversary Gifting';
    if (lower.includes('house') || lower.includes('warming')) return 'House Warming';
    if (lower.includes('wedding')) return 'Wedding Gifts';
    if (lower.includes('birthday')) return 'Birthday Gifts';
    if (lower.includes('festive')) return 'Festive Gifts';
    if (lower.includes('return') || lower.includes('monogram')) return 'Return Gifts';
    if (lower.includes('set') || lower.includes('keepsake') || lower.includes('hamper')) return 'Curated Gift Sets';
    if (lower.includes('eco')) return 'Eco-Friendly Gifts';
    if (lower.includes('occasion') || lower.includes('personal')) return 'Occasion Gifts';
  } else if (catId === 'wholesale-wood') {
    if (lower.includes('elephant')) return 'Elephant';
    if (lower.includes('buddha')) return 'Buddha';
    if (lower.includes('tea-light') || lower.includes('holder') || lower.includes('lantern')) return 'Tea-Light Holders';
    if (lower.includes('toy') || lower.includes('figurine')) return 'Traditional Toys & Figurines';
    if (lower.includes('box') || lower.includes('tray')) return 'Decorative Boxes & Trays';
  } else if (catId === 'wholesale-metal') {
    if (lower.includes('radha') || lower.includes('krishna')) return 'Radha Krishna';
    if (lower.includes('buddha')) return 'Buddha';
    if (lower.includes('music') || lower.includes('set')) return 'Musician Sets';
    if (lower.includes('elephant') || lower.includes('animal')) return 'Elephant & Animal';
    if (lower.includes('wall') || lower.includes('decor') || lower.includes('décor')) return 'Artistic Wall Décor';
  } else if (catId === 'export-wood') {
    if (lower.includes('tray')) return 'Wooden Decorative Trays';
    if (lower.includes('box') || lower.includes('organis')) return 'Wooden Boxes & Organisers';
    if (lower.includes('tea-light') || lower.includes('holder')) return 'Wooden Tea-Light Holders';
    if (lower.includes('figurine') || lower.includes('sculpt')) return 'Figurines & Sculptural Décor';
    if (lower.includes('toy') || lower.includes('play')) return 'Traditional Toys & Play Objects';
  } else if (catId === 'export-metal') {
    if (lower.includes('sculpt') || lower.includes('figurine')) return 'Metal Sculptural Figurines';
    if (lower.includes('table') || lower.includes('wall')) return 'Metal Table & Wall Décor';
    if (lower.includes('candle') || lower.includes('tea-light') || lower.includes('holder') || lower.includes('dia')) return 'Candle / Tea-Light Holders';
    if (lower.includes('music') || lower.includes('set')) return 'Indian Musician Sets';
  }

  return clean;
}

