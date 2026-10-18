import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, normalizeCategoryId } from '../../utils/formatters';

export default function SearchOverlay() {
  const {
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    products,
    categories,
    addToCart,
    setQuickViewProduct,
    filterByCategory,
    setSearchQuery: setGlobalSearchQuery
  } = useStore();

  const [localQuery, setLocalQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const results = useMemo(() => {
    const q = localQuery.toLowerCase().trim();
    return products.filter(p => {
      // 1. Category Filter
      if (selectedCat !== 'all') {
        const pCatId = p.categoryId || normalizeCategoryId(p.category);
        if (pCatId !== selectedCat) return false;
      }

      // 2. Query Match
      if (q === '') return true;
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subItem && p.subItem.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.craftOrigin && p.craftOrigin.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });
  }, [products, localQuery, selectedCat]);

  if (!isSearchOverlayOpen) return null;

  const handleSelectSuggestion = (term) => {
    setLocalQuery(term);
  };

  const handleViewAllInCatalog = () => {
    setGlobalSearchQuery(localQuery);
    if (selectedCat !== 'all') {
      filterByCategory(selectedCat);
    }
    setIsSearchOverlayOpen(false);
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="search-overlay active" id="searchOverlay">
      <div className="container search-container">
        {/* Search Bar Wrap */}
        <div className="search-bar-wrap">
          <i className="fa-solid fa-magnifying-glass search-input-icon"></i>

          <select
            className="search-category-select"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">All Collections</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="text"
            className="search-input-field"
            placeholder="Search artisan lamps, terracotta, wooden clocks, ESG kits..."
            autoFocus
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleViewAllInCatalog();
            }}
          />

          <button
            type="button"
            className="search-action-btn"
            onClick={handleViewAllInCatalog}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>

          <button
            type="button"
            className="search-close-btn"
            onClick={() => setIsSearchOverlayOpen(false)}
            aria-label="Close Search"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Popular Tags */}
        <div className="search-suggestions">
          <span>Popular:</span>
          <button type="button" onClick={() => handleSelectSuggestion('Lamp')}>Carved Wooden Lamp</button>
          <button type="button" onClick={() => handleSelectSuggestion('Terracotta')}>Terracotta Clay</button>
          <button type="button" onClick={() => handleSelectSuggestion('Clock')}>Wooden Clock</button>
          <button type="button" onClick={() => handleSelectSuggestion('Tea Light')}>Tea Light Candle</button>
          <button type="button" onClick={() => handleSelectSuggestion('ESG')}>ESG Gift Kit</button>
          <button type="button" onClick={() => handleSelectSuggestion('Monogram')}>Personalized Box</button>
        </div>

        {/* Results Header */}
        <div className="search-results-meta">
          <span>Found <strong>{results.length}</strong> matching creation{results.length === 1 ? '' : 's'}</span>
          {results.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline view-in-catalog-btn"
              onClick={handleViewAllInCatalog}
            >
              <i className="fa-solid fa-arrow-down"></i> View in Storefront Grid
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="search-results-grid">
          {results.length === 0 ? (
            <div className="search-empty-msg">
              <i className="fa-solid fa-magnifying-glass"></i>
              <p>No creations found matching "{localQuery}"</p>
              <span>Try selecting "All Collections" or searching for lamp, clock, terracotta, or brass</span>
            </div>
          ) : (
            results.slice(0, 16).map(p => {
              const pImg = p.image && (p.image.startsWith('http') || p.image.startsWith('data:') || p.image.startsWith('/'))
                ? p.image
                : (p.image ? `/${p.image}` : '/images/wooden-gallery.jpg');

              return (
                <div
                  key={p.id}
                  className="search-result-card"
                  onClick={() => {
                    setIsSearchOverlayOpen(false);
                    setQuickViewProduct(p);
                  }}
                >
                  <img
                    src={pImg}
                    alt={p.title || p.name}
                    className="search-result-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/wooden-gallery.jpg';
                    }}
                  />
                <div className="search-result-info">
                  <h5>{p.title || p.name}</h5>
                  <span className="search-result-cat">
                    {p.subItem || p.category} &bull; {formatPrice(p.price)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary search-card-bag-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                    setIsSearchOverlayOpen(false);
                  }}
                  title="Add to Shopping Bag"
                >
                  <i className="fa-solid fa-bag-shopping"></i>
                </button>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
