import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import { normalizeCategoryId } from '../../utils/formatters';

export default function ProductGrid() {
  const {
    products,
    categories,
    activeCategory,
    activeSubCategory,
    activeChannel,
    searchQuery,
    setSearchQuery,
    filterByCategory
  } = useStore();

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Channel Filter
      if (activeChannel !== 'all') {
        if (p.channel && p.channel !== activeChannel) return false;
      }

      // 2. Category Filter
      if (activeCategory !== 'all') {
        const pCatId = p.categoryId || normalizeCategoryId(p.category);
        if (pCatId !== activeCategory) return false;
      }

      // 3. Sub-Category Filter
      if (activeSubCategory) {
        const targetSub = activeSubCategory.toLowerCase();
        const sub = (p.subItem || p.subCategory || '').toLowerCase();
        if (!sub.includes(targetSub)) return false;
      }

      // 4. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (p.title || p.name || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchSub = (p.subItem || p.subCategory || '').toLowerCase().includes(q);
        const matchMat = (p.material || '').toLowerCase().includes(q);
        const matchOrigin = (p.origin || p.craftOrigin || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchSub && !matchMat && !matchOrigin && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeChannel, activeCategory, activeSubCategory, searchQuery]);

  const activeCategoryObj = categories.find(c => c.id === activeCategory);

  return (
    <section className="collections-section" id="categories" style={{ paddingTop: '20px' }}>
      <div className="container">
        {/* Header matching original luxury layout */}
        <div className="products-header">
          <div>
            <span className="section-eyebrow" style={{ marginBottom: '4px', display: 'block' }}>
              EXPLORE OUR DISCIPLINES
            </span>
            <h2
              className="products-section-title"
              style={{
                margin: '0 0 6px 0',
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                color: 'var(--color-primary)'
              }}
            >
              {activeCategory === 'all'
                ? 'FEATURED ARTISAN CREATIONS'
                : activeCategoryObj?.name?.toUpperCase() || 'CURATED CREATIONS'}
            </h2>
            <span className="product-count-label" id="productsCountText">
              Showing {filteredProducts.length} creations {activeSubCategory ? `in ${activeSubCategory}` : ''}
            </span>
          </div>

          {(searchQuery || activeCategory !== 'all' || activeSubCategory) && (
            <button
              type="button"
              className="btn btn-sm btn-outline reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                filterByCategory('all');
              }}
            >
              <i className="fa-solid fa-rotate-left"></i> Reset Filter
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="catalog-empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div className="empty-icon-wrap" style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginBottom: '16px' }}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h4 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '8px' }}>No creations found</h4>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              We couldn't find any crafts matching your current query. Try clearing filters or exploring all collections.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery('');
                filterByCategory('all');
              }}
            >
              Explore All Collections
            </button>
          </div>
        ) : (
          /* Responsive Product Cards Grid */
          <div className="product-cards-grid" id="productGrid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
