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
    <section className="product-catalog-section">
      <div className="container">
        {/* Results Bar */}
        <div className="catalog-status-header">
          <div className="status-title-group">
            <h3 className="catalog-active-heading">
              {activeCategory === 'all'
                ? 'All Artisan Masterpieces'
                : activeCategoryObj?.name || 'Curated Creations'}
              {activeSubCategory ? ` • ${activeSubCategory}` : ''}
            </h3>
            <span className="catalog-count-pill">
              Showing {filteredProducts.length} Heirloom{filteredProducts.length === 1 ? '' : 's'}
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
              <i className="fa-solid fa-rotate-left"></i> Reset Filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="catalog-empty-state">
            <div className="empty-icon-wrap">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h4>No creations found</h4>
            <p>
              We couldn't find any crafts matching your current search or category filter. Try clearing your search query or selecting another craft collection.
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
          /* Products Grid */
          <div className="product-grid" id="productGrid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
