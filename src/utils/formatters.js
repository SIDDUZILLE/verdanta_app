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

export function normalizeCategoryId(cat) {
  if (!cat) return 'artisan-gallery';
  const c = String(cat).toLowerCase().trim();
  if (c.includes('artisan') || c.includes('clay') || c.includes('terracotta') || c.includes('lamp')) return 'artisan-gallery';
  if (c.includes('wood') || c.includes('clock') || c.includes('toy')) return 'wooden-gallery';
  if (c.includes('decor') || c.includes('brass') || c.includes('urli') || c.includes('home')) return 'premium-home-decor';
  if (c.includes('gift') || c.includes('personal') || c.includes('festive') || c.includes('return')) return 'personalization-gifting';
  if (c.includes('corp') || c.includes('esg') || c.includes('employee')) return 'corporate-gifting';
  if (c.includes('wholesale') && c.includes('metal')) return 'wholesale-metal';
  if (c.includes('wholesale')) return 'wholesale-wood';
  if (c.includes('export') && c.includes('metal')) return 'export-metal';
  if (c.includes('export')) return 'export-wood';
  return c.replace(/\s+/g, '-');
}
