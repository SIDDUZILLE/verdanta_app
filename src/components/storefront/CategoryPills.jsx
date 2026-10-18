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
  const currentCatObj = categories.find(c => c.id === activeCategory);

  const resolveImage = (img) => {
    if (!img) return '/images/wooden-gallery.jpg';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('blob:')) {
      return img;
    }
    return img.startsWith('/') ? img : `/${img}`;
  };

  const getCategoryCoverImage = (cat) => {
    if (cat && cat.image && typeof cat.image === 'string' && cat.image.trim()) {
      return resolveImage(cat.image.trim());
    }
    const catProd = products.find(p => {
      const pCatId = p.categoryId || p.category;
      return (pCatId === cat.id || p.category === cat.name) && p.image;
    });
    if (catProd && catProd.image) {
      return resolveImage(catProd.image);
    }
    return '/images/wooden-gallery.jpg';
  };

  return (
    <section className="collections-section" id="collections" style={{ paddingBottom: '0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="section-eyebrow" style={{ color: 'var(--color-gold)', letterSpacing: '2px' }}>
            CURATED INDIAN DISCIPLINES
          </span>
          <h2
            className="section-title"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.4rem',
              color: 'var(--color-primary)',
              margin: '6px 0 12px 0'
            }}
          >
            Shop By Craft Discipline
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
            Handcrafted terracotta pottery, sculpted teakwood heirlooms, brass urlis, and bespoke artisan gifting sets.
          </p>
        </div>

        {/* 4 Main Visual Category Cards Grid */}
        <div className="category-cards-grid">
          {shopCategories.map((cat, idx) => {
            const count = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;
            const isSelected = activeCategory === cat.id;
            const coverImg = getCategoryCoverImage(cat);

            return (
              <div
                key={cat.id}
                className="category-card"
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--color-gold)' : undefined,
                  boxShadow: isSelected ? 'var(--shadow-md)' : undefined
                }}
                onClick={() => {
                  filterByCategory(cat.id);
                  const el = document.getElementById('categories');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="category-card-image-wrap" style={{ height: '220px' }}>
                  <img
                    src={coverImg}
                    alt={cat.name}
                    className="category-card-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/wooden-gallery.jpg';
                    }}
                  />
                  <span className="category-tag-badge">
                    {cat.badge || `Collection 0${idx + 1}`}
                  </span>
                </div>

                <div className="category-card-content" style={{ padding: '18px' }}>
                  <h3 className="category-card-title" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
                    {cat.name}
                  </h3>

                  {cat.subCategories && (
                    <ul className="subcategories-tag-list" style={{ marginBottom: '8px' }}>
                      {cat.subCategories.slice(0, 4).map((sub, sIdx) => (
                        <li key={sIdx}>
                          <button
                            type="button"
                            className="subcategory-pill-btn"
                            style={{
                              background: 'rgba(197, 157, 95, 0.08)',
                              border: '1px solid rgba(197, 157, 95, 0.25)',
                              borderRadius: '20px',
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginRight: '4px',
                              marginBottom: '4px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              filterByCategory(cat.id);
                              setActiveSubCategory(sub);
                              const el = document.getElementById('categories');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            <i className="fa-solid fa-angle-right" style={{ fontSize: '0.6rem', color: 'var(--color-gold)' }}></i>
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="category-card-snippet" style={{ fontSize: '0.82rem', marginBottom: '14px' }}>
                    {cat.description}
                  </p>

                  <div className="category-card-btn" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <span>{count} CREATIONS</span>
                    <span>
                      EXPLORE <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* Catalog Search & Sub-category Filter Bar */}
        <div
          className="catalog-search-inline"
          style={{
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: '30px',
            padding: '6px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--color-gold)', marginRight: '10px' }}></i>
          <input
            type="text"
            placeholder="Search creations by name, craft, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '8px 0',
              fontSize: '0.9rem',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ color: '#888', padding: '0 8px' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Sub-Category Pills for Active Category */}
        {currentCatObj?.subCategories?.length > 0 && (
          <div
            className="subcategories-jump-bar"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '28px'
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${activeSubCategory === null ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '20px', fontSize: '0.78rem', padding: '6px 14px' }}
              onClick={() => setActiveSubCategory(null)}
            >
              All {currentCatObj.name}
            </button>
            {currentCatObj.subCategories.map((sub, sIdx) => (
              <button
                key={sIdx}
                type="button"
                className={`btn btn-sm ${activeSubCategory === sub ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', fontSize: '0.78rem', padding: '6px 14px' }}
                onClick={() => setActiveSubCategory(sub === activeSubCategory ? null : sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
