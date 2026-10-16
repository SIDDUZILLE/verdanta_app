import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice, normalizeCategoryId } from '../../utils/formatters';

export default function ProductList({ onOpenAdd, onEditProduct, onOpenAddCategory, onEditCategory }) {
  const { products, categories, deleteProduct, toggleProductStock, addSubCategory } = useAdmin();
  const [currentChannel, setCurrentChannel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickSubPromptCat, setQuickSubPromptCat] = useState(null);
  const [newSubName, setNewSubName] = useState('');

  // Filter categories by channel
  const filteredCategories = useMemo(() => {
    let list = [...categories];
    if (currentChannel !== 'all') {
      list = list.filter(c => (c.channel || 'shop') === currentChannel);
    }
    return list;
  }, [categories, currentChannel]);

  const channelLabels = {
    all: 'All Departments',
    shop: 'Shop Collections',
    corporate: 'Corporate Gifting',
    wholesale: 'Wholesale B2B',
    export: 'Export & Global'
  };

  const query = searchQuery.trim().toLowerCase();

  const handleQuickAddSub = (catId) => {
    if (!newSubName.trim()) return;
    addSubCategory(catId, newSubName.trim());
    setNewSubName('');
    setQuickSubPromptCat(null);
  };

  return (
    <section className="tab-pane active" id="tab-products">
      {/* Intro Header */}
      <div className="cat-management-intro">
        <div className="cat-intro-content">
          <h3>
            <i className="fa-solid fa-layer-group"></i> Category &amp; Channel Product Management
          </h3>
          <p>
            Every category across <strong>Shop, Corporate Gifting, Wholesale &amp; Export</strong> has its own separate <strong>"+ Add Photo"</strong> section. Products and photos added automatically synchronize with the customer storefront.
          </p>
        </div>
        <div className="cat-intro-meta" id="totalCategoryCountBadge">
          <span>
            {filteredCategories.length} Categories in {channelLabels[currentChannel]} • {products.length} Total Photos / Items
          </span>
        </div>
      </div>

      {/* Department / Channel Filter Pills */}
      <div className="channel-filter-bar">
        <span className="channel-filter-label">
          <i className="fa-solid fa-filter"></i> Channel:
        </span>
        <div className="channel-filter-pills" id="channelFilterPills">
          <button
            type="button"
            className={`channel-pill-btn ${currentChannel === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentChannel('all')}
          >
            <i className="fa-solid fa-layer-group"></i> All Departments ({categories.length})
          </button>
          <button
            type="button"
            className={`channel-pill-btn ${currentChannel === 'shop' ? 'active' : ''}`}
            onClick={() => setCurrentChannel('shop')}
          >
            <i className="fa-solid fa-store"></i> Shop Collections
          </button>
          <button
            type="button"
            className={`channel-pill-btn ${currentChannel === 'corporate' ? 'active' : ''}`}
            onClick={() => setCurrentChannel('corporate')}
          >
            <i className="fa-solid fa-briefcase"></i> Corporate Gifting
          </button>
          <button
            type="button"
            className={`channel-pill-btn ${currentChannel === 'wholesale' ? 'active' : ''}`}
            onClick={() => setCurrentChannel('wholesale')}
          >
            <i className="fa-solid fa-boxes-packing"></i> Wholesale
          </button>
          <button
            type="button"
            className={`channel-pill-btn ${currentChannel === 'export' ? 'active' : ''}`}
            onClick={() => setCurrentChannel('export')}
          >
            <i className="fa-solid fa-earth-americas"></i> Export &amp; Global
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Action Buttons */}
      <div className="table-toolbar category-toolbar">
        <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, minWidth: '260px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              id="productSearchInput"
              placeholder="Filter products across all categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onOpenAdd()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, whiteSpace: 'nowrap', padding: '10px 18px', background: 'var(--color-gold)', borderColor: 'var(--color-gold)', boxShadow: '0 2px 8px rgba(197, 157, 95, 0.3)' }}
            >
              <i className="fa-solid fa-camera"></i> + Add Product Photo
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onOpenAddCategory}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, whiteSpace: 'nowrap', padding: '10px 18px', background: '#fff' }}
            >
              <i className="fa-solid fa-folder-plus"></i> + Add New Category
            </button>
          </div>
        </div>

        {/* Category Jump Pills */}
        <div className="category-jump-pills" id="categoryJumpPills">
          {filteredCategories.map(cat => (
            <a
              key={cat.id}
              href={`#cat-sec-${cat.id}`}
              className="cat-jump-pill"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* Category Sections Container */}
      <div className="category-sections-vertical" id="categorySectionsContainer">
        {filteredCategories.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)', background: '#ffffff', borderRadius: '8px', border: '1px dashed var(--color-border)', marginTop: '20px' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '2.2rem', color: 'var(--color-gold)', marginBottom: '12px', display: 'inline-block' }}></i>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '6px' }}>No categories found in this department</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '18px' }}>Click "+ Add New Category" to create a new category in this department.</p>
            <button type="button" className="btn btn-primary" onClick={onOpenAddCategory}>
              + Add Category
            </button>
          </div>
        ) : (
          filteredCategories.map(cat => {
            const allCatProducts = products.filter(p => {
              const pCatId = p.categoryId || normalizeCategoryId(p.category);
              return pCatId === cat.id;
            });

            // Extract unique subcategories
            const subs = cat.subCategories && cat.subCategories.length > 0
              ? cat.subCategories
              : ['Default Collection'];

            const channel = cat.channel || 'shop';
            const catChannelLabel = cat.channelName || channelLabels[channel] || channel.toUpperCase();

            return (
              <section className="admin-category-section" id={`cat-sec-${cat.id}`} key={cat.id}>
                {/* Category Header */}
                <div className="admin-cat-header">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div
                      className="admin-cat-cover-thumb-wrap"
                      onClick={() => onEditCategory && onEditCategory(cat)}
                      title="Click to edit category"
                      style={{ position: 'relative', width: '84px', height: '84px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ecd8b4', flexShrink: 0, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#fdfbf7' }}
                    >
                      <img
                        src={cat.image || 'images/wooden-gallery.jpg'}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'images/wooden-gallery.jpg'; }}
                      />
                      <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(26,20,16,0.78)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', padding: '2px 0', letterSpacing: '0.5px' }}>
                        COVER
                      </span>
                    </div>

                    <div className="admin-cat-title-block" style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-cat-pill-row">
                        <span className={`cat-channel-tag tag-${channel}`}>
                          <i className="fa-solid fa-tag"></i> {catChannelLabel}
                        </span>
                        <span className="admin-cat-badge">{cat.badge || 'Collection'}</span>
                        <span className="admin-cat-count-pill">{allCatProducts.length} Total Photos</span>
                        <span className="admin-cat-sub-count-pill" style={{ background: '#f4efe6', color: 'var(--color-primary)', fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>
                          {subs.length} Subtitle Categories
                        </span>
                      </div>
                      <h3 className="admin-cat-title">{cat.displayName || cat.name}</h3>
                      <p className="admin-cat-description">{cat.description || 'Artisan handcrafted creations.'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-cat"
                      onClick={() => onEditCategory && onEditCategory(cat)}
                      style={{ background: '#ffffff', border: '1px solid var(--color-gold)', color: 'var(--color-primary)', padding: '8px 14px', fontWeight: 700, fontSize: '0.8rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="fa-solid fa-camera"></i> Change Cover / Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-add-cat-product"
                      onClick={() => onOpenAdd(cat.name)}
                    >
                      <i className="fa-solid fa-plus"></i> + Add Photo to {cat.name}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-cat"
                      onClick={() => setQuickSubPromptCat(quickSubPromptCat === cat.id ? null : cat.id)}
                      style={{ background: '#ffffff', border: '1px solid var(--color-border)', padding: '8px 14px', fontWeight: 600, fontSize: '0.8rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="fa-solid fa-folder-plus"></i> + Add Subtitle
                    </button>
                  </div>
                </div>

                {/* Quick Add Subtitle Form inline */}
                {quickSubPromptCat === cat.id && (
                  <div style={{ marginTop: '14px', background: '#faf7f0', padding: '12px 16px', borderRadius: '8px', border: '1px dashed #dcd4c5', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>New Subtitle Category Name:</span>
                    <input
                      type="text"
                      placeholder="e.g. Wall Décor & Hangings"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--color-border)', fontSize: '0.85rem', width: '240px' }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAddSub(cat.id); }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleQuickAddSub(cat.id)}
                    >
                      <i className="fa-solid fa-check"></i> Add Subtitle
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => setQuickSubPromptCat(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Subtitle Category Quick Jump Navigation Pills */}
                <div className="admin-subcat-nav-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
                  <span className="subcat-nav-label" style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600 }}>
                    <i className="fa-solid fa-tags"></i> Subtitle Categories:
                  </span>
                  {subs.map((subName, sIdx) => {
                    const count = allCatProducts.filter(p => (p.subItem || p.subCategory || '').toLowerCase() === subName.toLowerCase()).length;
                    const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <a
                        key={sIdx}
                        href={`#subcat-${cat.id}-${subSlug}`}
                        className="subcat-pill-link"
                        style={{ fontSize: '0.78rem', background: '#faf8f5', border: '1px solid #e5dfd3', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '14px', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {subName} ({count})
                      </a>
                    );
                  })}
                </div>

                {/* Section Divider */}
                <div className="admin-cat-divider">
                  <span className="admin-cat-divider-title">Subtitle Categories in {cat.name}</span>
                  <div className="admin-cat-divider-line"></div>
                </div>

                {/* Vertical Stack of Subtitle Categories with Separate Add Photo Sections */}
                <div className="admin-subcategories-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {subs.map((subName, sIdx) => {
                    let subProducts = allCatProducts.filter(p => {
                      const pSub = (p.subItem || p.subCategory || '').toLowerCase();
                      return pSub === subName.toLowerCase() || (subs.length === 1 && !p.subItem);
                    });

                    // Search filtering
                    if (query !== '') {
                      subProducts = subProducts.filter(p =>
                        (p.title && p.title.toLowerCase().includes(query)) ||
                        (p.name && p.name.toLowerCase().includes(query)) ||
                        (p.subItem && p.subItem.toLowerCase().includes(query)) ||
                        (p.material && p.material.toLowerCase().includes(query)) ||
                        (p.origin && p.origin.toLowerCase().includes(query))
                      );
                    }

                    const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                    return (
                      <div className="admin-subcat-section-card" id={`subcat-${cat.id}-${subSlug}`} key={sIdx} style={{ background: '#faf9f6', border: '1px solid #ece7dd', borderRadius: '10px', padding: '18px 20px' }}>
                        <div className="admin-subcat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                          <div className="admin-subcat-header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="admin-subcat-icon-badge" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f4efe6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                              <i className="fa-solid fa-layer-group"></i>
                            </div>
                            <div>
                              <h4 className="admin-subcat-name" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                                {subName}
                              </h4>
                              <span className="admin-subcat-meta" style={{ fontSize: '0.78rem', color: '#888' }}>
                                {subProducts.length} Photo{subProducts.length === 1 ? '' : 's'} in {subName}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-add-subcat-photo"
                            onClick={() => onOpenAdd(cat.name, subName)}
                            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <i className="fa-solid fa-camera"></i> + Add Photo to {subName}
                          </button>
                        </div>

                        <div className="admin-subcat-body">
                          {subProducts.length === 0 ? (
                            <div className="admin-subcat-empty" style={{ textAlign: 'center', padding: '30px 20px', background: '#fff', border: '1px dashed #dcd4c5', borderRadius: '8px' }}>
                              <i className="fa-regular fa-image" style={{ fontSize: '1.8rem', color: '#ccc', marginBottom: '8px', display: 'inline-block' }}></i>
                              <div style={{ marginBottom: '10px' }}>
                                <strong style={{ display: 'block', fontSize: '0.92rem', color: '#555' }}>No photos added yet in {subName}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Click "+ Add Photo to {subName}" to add photos separately for this subtitle category.</span>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => onOpenAdd(cat.name, subName)}
                                style={{ fontSize: '0.8rem' }}
                              >
                                <i className="fa-solid fa-plus"></i> Add First Photo
                              </button>
                            </div>
                          ) : (
                            <div className="admin-cat-products-grid">
                              {subProducts.map(prod => (
                                <div
                                  className={`admin-product-card ${prod.outOfStock ? 'is-out-of-stock' : ''}`}
                                  id={`admin-prod-${prod.id}`}
                                  key={prod.id}
                                >
                                  <div className="admin-prod-thumb-wrap">
                                    <img
                                      src={prod.image || 'images/wooden-gallery.jpg'}
                                      alt={prod.title || prod.name}
                                      className="admin-prod-thumb"
                                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'images/wooden-gallery.jpg'; }}
                                    />
                                    <span className="admin-prod-badge">{prod.badge || 'Artisan Signature'}</span>
                                    {prod.outOfStock ? (
                                      <span className="admin-stock-tag is-out">
                                        <i className="fa-solid fa-ban"></i> OUT OF STOCK
                                      </span>
                                    ) : (
                                      <span className="admin-stock-tag is-in">
                                        <i className="fa-solid fa-circle-check"></i> IN STOCK
                                      </span>
                                    )}
                                  </div>

                                  <div className="admin-prod-details">
                                    <span className="admin-prod-sub-tag">
                                      <i className="fa-solid fa-tag"></i> {subName}
                                    </span>
                                    <h4 className="admin-prod-title">{prod.title || prod.name}</h4>
                                    <div className="admin-prod-price-row">
                                      {prod.mrp && Number(prod.mrp) > (Number(prod.price) || 0) && (
                                        <>
                                          <span className="card-discount-pct" style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', marginRight: '4px' }}>
                                            <i className="fa-solid fa-arrow-down"></i>
                                            {Math.round(((prod.mrp - (prod.price || 0)) / prod.mrp) * 100)}%
                                          </span>
                                          <span className="card-mrp-price" style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#999', marginRight: '6px' }}>
                                            ₹{Number(prod.mrp).toLocaleString('en-IN')}
                                          </span>
                                        </>
                                      )}
                                      <span className="admin-prod-price">
                                        {formatPrice(prod.price)}
                                      </span>
                                      {prod.origin && (
                                        <span className="admin-prod-origin">
                                          <i className="fa-solid fa-location-dot"></i> {prod.origin}
                                        </span>
                                      )}
                                    </div>
                                    {prod.description && (
                                      <p className="admin-prod-desc-snippet">{prod.description}</p>
                                    )}
                                  </div>

                                  <div className="admin-prod-actions">
                                    <button
                                      type="button"
                                      className={`btn-card-action btn-card-stock ${prod.outOfStock ? 'is-out' : 'is-in'}`}
                                      onClick={() => toggleProductStock(prod.id)}
                                      title="Toggle Stock Availability"
                                    >
                                      <i className={`fa-solid ${prod.outOfStock ? 'fa-ban' : 'fa-circle-check'}`}></i>
                                      {prod.outOfStock ? 'Out of Stock' : 'In Stock'}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-card-action btn-card-edit"
                                      onClick={() => onEditProduct(prod)}
                                      title="Edit Product Details"
                                    >
                                      <i className="fa-solid fa-pen-to-square"></i> Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-card-action btn-card-delete"
                                      onClick={() => {
                                        if (window.confirm(`Delete "${prod.title || prod.name}"?`)) {
                                          deleteProduct(prod.id);
                                        }
                                      }}
                                      title="Delete Product"
                                    >
                                      <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </section>
  );
}
