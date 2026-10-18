import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import { normalizeCategoryId, normalizeSubCategory } from '../../utils/formatters';

export default function ProductGrid() {
  const {
    products,
    categories,
    activeCategory,
    activeSubCategory,
    activeChannel,
    searchQuery,
    setSearchQuery,
    filterByCategory,
    setActiveSubCategory
  } = useStore();

  // Helper to filter products belonging to a category
  const getCategoryProducts = (cat, prods) => {
    const normCatId = cat.id;
    const catNameLower = (cat.name || '').toLowerCase().trim();
    return prods.filter(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      const pCatLower = (p.category || '').toLowerCase().trim();
      return pCatId === normCatId || pCatLower === catNameLower;
    });
  };

  // Helper to group category products by defined subcategories
  const groupCategoryProducts = (cat, catProducts) => {
    const definedSubs = Array.isArray(cat.subCategories) ? cat.subCategories : [];
    const groups = [];
    const matchedProductIds = new Set();

    definedSubs.forEach(sub => {
      const items = catProducts.filter(p => {
        const normSub = normalizeSubCategory(cat.id, p.subItem || p.subCategory, cat);
        return normSub === sub;
      });

      if (items.length > 0) {
        groups.push({ subName: sub, items });
        items.forEach(i => matchedProductIds.add(i.id));
      }
    });

    const remaining = catProducts.filter(p => !matchedProductIds.has(p.id));
    if (remaining.length > 0) {
      const extraGroups = {};
      remaining.forEach(p => {
        const sub = normalizeSubCategory(cat.id, p.subItem || p.subCategory, cat) || 'Curated Creations';
        if (!extraGroups[sub]) extraGroups[sub] = [];
        extraGroups[sub].push(p);
      });
      Object.entries(extraGroups).forEach(([subName, items]) => {
        groups.push({ subName, items });
      });
    }

    if (groups.length === 0 && catProducts.length > 0) {
      groups.push({ subName: 'All Creations', items: catProducts });
    }

    return groups;
  };

  // 1. Search Query Filter
  const searchResults = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => {
      const matchTitle = (p.title || p.name || '').toLowerCase().includes(q);
      const matchCat = (p.category || '').toLowerCase().includes(q);
      const matchSub = (p.subItem || p.subCategory || '').toLowerCase().includes(q);
      const matchMat = (p.material || '').toLowerCase().includes(q);
      const matchOrigin = (p.origin || p.craftOrigin || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      return matchTitle || matchCat || matchSub || matchMat || matchOrigin || matchDesc;
    });
  }, [products, searchQuery]);

  // Active Category Object
  const activeCategoryObj = useMemo(() => {
    if (activeCategory === 'all') return null;
    return categories.find(c => c.id === activeCategory || c.name === activeCategory);
  }, [categories, activeCategory]);

  // Categories to render for Category-wise Flow
  const displayCategories = useMemo(() => {
    if (activeCategory !== 'all') {
      const target = categories.find(c => c.id === activeCategory || c.name === activeCategory);
      return target ? [target] : [];
    }

    if (activeChannel === 'wholesale') {
      return categories.filter(c => c.channel === 'wholesale');
    }
    if (activeChannel === 'export') {
      return categories.filter(c => c.channel === 'export');
    }
    if (activeChannel === 'corporate') {
      return categories.filter(c => c.channel === 'corporate');
    }
    if (activeChannel === 'shop') {
      return categories.filter(c => c.channel === 'shop' || !c.channel);
    }

    // Default: 'all' -> Render all categories in order (Shop, Corporate, Wholesale, Export)
    return categories;
  }, [categories, activeCategory, activeChannel]);


  return (
    <section className="collections-section" id="categories" style={{ paddingTop: '10px' }}>
      <div className="container">
        {/* Section Header */}
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
              {searchResults !== null
                ? 'SEARCH RESULTS'
                : activeCategory === 'all'
                ? 'FEATURED ARTISAN CREATIONS'
                : activeCategoryObj?.name?.toUpperCase() || 'CURATED CREATIONS'}
            </h2>
            <span className="product-count-label" id="productsCountText">
              {searchResults !== null
                ? `Showing ${searchResults.length} search result${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
                : activeSubCategory
                ? `Showing creations in ${activeCategoryObj?.name || 'Collection'} › ${activeSubCategory}`
                : activeCategory !== 'all'
                ? `Showing all creations in ${activeCategoryObj?.name || 'Collection'}`
                : `Showing handcrafted creations across curated craft disciplines`}
            </span>
          </div>

          {/* Reset / Clear Filters Action */}
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

        {/* 1. Active Search Query State */}
        {searchResults !== null ? (
          <div>
            <div className="catalog-active-filter-banner" style={{ marginBottom: '28px' }}>
              <div className="filter-info">
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--color-gold)' }}></i>
                <span>
                  Search Results for <strong className="filter-crumb">"{searchQuery}"</strong> &bull;{' '}
                  <strong>{searchResults.length}</strong> artisan creation{searchResults.length === 1 ? '' : 's'} found
                </span>
              </div>
              <button
                type="button"
                className="filter-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <i className="fa-solid fa-xmark"></i> Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="catalog-empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginBottom: '16px', display: 'block' }}></i>
                <h4 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
                  No creations found for "{searchQuery}"
                </h4>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  Try searching for lamps, terracotta, wooden clocks, brass urlis, or explore all collections.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setSearchQuery('')}
                >
                  View Complete Artisan Catalogue
                </button>
              </div>
            ) : (
              <div className="product-cards-grid" id="productGrid">
                {searchResults.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : activeSubCategory && activeCategoryObj ? (
          /* 2. Active Subcategory Filter State */
          <div>
            {(() => {
              const subQ = activeSubCategory.toLowerCase().trim();
              const catProds = getCategoryProducts(activeCategoryObj, products);
              const subFiltered = catProds.filter(p => {
                const normSub = normalizeSubCategory(activeCategoryObj.id, p.subItem || p.subCategory, activeCategoryObj).toLowerCase();
                const pSub = (p.subItem || p.subCategory || '').toLowerCase();
                const pTitle = (p.title || p.name || '').toLowerCase();
                return normSub === subQ || pSub.includes(subQ) || subQ.includes(pSub) || pTitle.includes(subQ);
              });

              return (
                <div>
                  <div className="catalog-active-filter-banner" style={{ marginBottom: '28px' }}>
                    <div className="filter-info">
                      <i className="fa-solid fa-layer-group" style={{ color: 'var(--color-gold)' }}></i>
                      <span>
                        Collection:{' '}
                        <strong className="filter-crumb">
                          {activeCategoryObj.name} &rsaquo; {activeSubCategory}
                        </strong>{' '}
                        &bull; <strong>{subFiltered.length}</strong> creation{subFiltered.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="filter-clear-btn"
                      onClick={() => setActiveSubCategory(null)}
                    >
                      <i className="fa-solid fa-xmark"></i> Show All in {activeCategoryObj.name}
                    </button>
                  </div>

                  <div className="public-category-block" id={`pub-cat-${activeCategoryObj.id}`}>
                    <div className="public-cat-header">
                      <div className="public-cat-title-wrap">
                        <span className="public-cat-eyebrow">{activeCategoryObj.badge || 'Collection'}</span>
                        <h3 className="public-cat-title">
                          {activeCategoryObj.name.toUpperCase()} &mdash; {activeSubCategory.toUpperCase()}
                        </h3>
                      </div>
                      <span className="public-cat-count">
                        {subFiltered.length} Artisan Creation{subFiltered.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {subFiltered.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)', background: '#faf9f6', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
                        <p style={{ margin: '0 0 16px', fontSize: '1rem' }}>
                          <i className="fa-solid fa-sparkles" style={{ color: 'var(--color-gold)', marginRight: '6px' }}></i>
                          No items specifically listed under "{activeSubCategory}" right now.
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setActiveSubCategory(null)}
                        >
                          View All {activeCategoryObj.name}
                        </button>
                      </div>
                    ) : (
                      <div className="product-cards-grid">
                        {subFiltered.map(p => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* 3. Category-Wise Flow: Renders Every Category Block with Subcategory Groups */
          <div>
            {activeCategory !== 'all' && activeCategoryObj && (
              <div className="catalog-active-filter-banner" style={{ marginBottom: '28px' }}>
                <div className="filter-info">
                  <i className="fa-solid fa-layer-group" style={{ color: 'var(--color-gold)' }}></i>
                  <span>
                    Collection: <strong className="filter-crumb">{activeCategoryObj.name}</strong> &bull;{' '}
                    <strong>{getCategoryProducts(activeCategoryObj, products).length}</strong> artisan creation
                    {getCategoryProducts(activeCategoryObj, products).length === 1 ? '' : 's'}
                  </span>
                </div>
                <button
                  type="button"
                  className="filter-clear-btn"
                  onClick={() => filterByCategory('all')}
                >
                  <i className="fa-solid fa-xmark"></i> View All Collections
                </button>
              </div>
            )}

            <div className="product-catalog-flow" id="productCatalogGrid">
              {displayCategories.map((cat, idx) => {
                const catProds = getCategoryProducts(cat, products);
                if (catProds.length === 0 && activeCategory === 'all') {
                  return null; // Skip empty categories in 'all' view
                }

                const subGroups = groupCategoryProducts(cat, catProds);

                return (
                  <div className="public-category-block" key={cat.id} id={`pub-cat-${cat.id}`}>
                    {/* Category Block Header */}
                    <div className="public-cat-header">
                      <div className="public-cat-title-wrap">
                        <span className="public-cat-eyebrow">
                          {cat.badge || `Collection 0${idx + 1}`}
                        </span>
                        <h3 className="public-cat-title">{cat.name.toUpperCase()}</h3>
                      </div>
                      <span className="public-cat-count">
                        {catProds.length} Artisan Creation{catProds.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {catProds.length === 0 ? (
                      <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--color-text-muted)', background: '#faf9f6', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>
                          <i className="fa-solid fa-sparkles" style={{ color: 'var(--color-gold)', marginRight: '6px' }}></i>
                          New artisan creations for {cat.name} arriving soon. Inquire directly for bespoke requests.
                        </p>
                      </div>
                    ) : (
                      /* Grouped By Subcategories */
                      <div className="public-subcategories-wrap">
                        {subGroups.map((g, gIdx) => (
                          <div className="public-subcat-group" key={gIdx}>
                            <div className="public-subcat-heading-bar">
                              <h4 className="public-subcat-title">
                                <i className="fa-solid fa-layer-group"></i> {g.subName}
                              </h4>
                              <span className="public-subcat-count-pill">
                                {g.items.length} {g.items.length === 1 ? 'Creation' : 'Creations'}
                              </span>
                            </div>

                            <div className="product-cards-grid">
                              {g.items.map(p => (
                                <ProductCard key={p.id} product={p} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
