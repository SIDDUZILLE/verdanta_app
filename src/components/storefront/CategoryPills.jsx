import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function CategoryPills() {
  const {
    categories,
    products,
    activeCategory,
    activeSubCategory,
    activeChannel,
    searchQuery,
    setSearchQuery,
    filterByCategory,
    setActiveSubCategory,
    filterByChannel
  } = useStore();

  const shopCategories = categories.filter(c => c.channel === 'shop');

  // Find currently active category object
  const currentCatObj = categories.find(c => c.id === activeCategory);

  return (
    <section className="catalog-controls-section" id="categories">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="section-eyebrow">CURATED HERITAGE TAXONOMY</span>
          <h2 className="section-title">Explore Indian Craft Collections</h2>
          <p className="section-desc">
            Handmade earthen pottery, sculpted brass urlis, carved teakwood heirlooms, and corporate eco-gifting creations.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="channel-filter-tabs">
          <button
            type="button"
            className={`channel-tab-btn ${activeChannel === 'all' ? 'active' : ''}`}
            onClick={() => filterByChannel('all')}
          >
            All Portfolios
          </button>
          <button
            type="button"
            className={`channel-tab-btn ${activeChannel === 'shop' ? 'active' : ''}`}
            onClick={() => filterByChannel('shop')}
          >
            <i className="fa-solid fa-shop"></i> Retail Collections
          </button>
          <button
            type="button"
            className={`channel-tab-btn ${activeChannel === 'corporate' ? 'active' : ''}`}
            onClick={() => {
              filterByChannel('corporate');
              const el = document.getElementById('corporate');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-briefcase"></i> Corporate Gifting
          </button>
          <button
            type="button"
            className={`channel-tab-btn ${activeChannel === 'wholesale' ? 'active' : ''}`}
            onClick={() => {
              filterByChannel('wholesale');
              const el = document.getElementById('wholesale');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-boxes-stacked"></i> Wholesale
          </button>
          <button
            type="button"
            className={`channel-tab-btn ${activeChannel === 'export' ? 'active' : ''}`}
            onClick={() => {
              filterByChannel('export');
              const el = document.getElementById('export');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-earth-americas"></i> Global Export
          </button>
        </div>

        {/* 4 Featured Category Showcase Cards */}
        <div className="category-showcase-grid">
          {shopCategories.map((cat, idx) => {
            const count = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                className={`category-showcase-card ${isSelected ? 'active-category' : ''}`}
                onClick={() => filterByCategory(cat.id)}
              >
                <div
                  className="cat-card-bg"
                  style={{ backgroundImage: `url("${cat.image || 'images/wooden-gallery.jpg'}")` }}
                >
                  <div className="cat-card-gradient"></div>
                </div>
                <div className="cat-card-content">
                  <span className="cat-card-badge">{cat.badge || `Collection 0${idx + 1}`}</span>
                  <h3 className="cat-card-title">{cat.name}</h3>
                  <p className="cat-card-desc">{cat.description}</p>
                  <div className="cat-card-footer">
                    <span className="cat-card-count">{count} Creations</span>
                    <span className="cat-card-action">
                      View Collection <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Catalog Search & Sub-Category Filter Bar */}
        <div className="catalog-filter-bar">
          <div className="catalog-search-wrap">
            <i className="fa-solid fa-magnifying-glass search-bar-icon"></i>
            <input
              type="text"
              className="catalog-search-input"
              id="catalogSearchInput"
              placeholder="Search by craft, terracotta, wooden clock, lamp, brass urli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Sub-Category Pills */}
          {currentCatObj && currentCatObj.subCategories && currentCatObj.subCategories.length > 0 && (
            <div className="sub-category-pills">
              <button
                type="button"
                className={`sub-cat-pill ${activeSubCategory === null ? 'active' : ''}`}
                onClick={() => setActiveSubCategory(null)}
              >
                All {currentCatObj.name}
              </button>
              {currentCatObj.subCategories.map((sub, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  className={`sub-cat-pill ${activeSubCategory === sub ? 'active' : ''}`}
                  onClick={() => setActiveSubCategory(sub === activeSubCategory ? null : sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
