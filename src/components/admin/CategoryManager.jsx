import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function CategoryManager({ onOpenAddCategory, onEditCategory }) {
  const { categories, products, deleteCategory, addSubCategory, deleteSubCategory } = useAdmin();
  const [currentChannel, setCurrentChannel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [subInputs, setSubInputs] = useState({});

  const filteredCategories = useMemo(() => {
    let list = [...categories];
    if (currentChannel !== 'all') {
      list = list.filter(c => (c.channel || 'shop') === currentChannel);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.subCategories || []).some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [categories, currentChannel, searchQuery]);

  const handleSubInputChange = (catId, val) => {
    setSubInputs(prev => ({ ...prev, [catId]: val }));
  };

  const handleAddSub = (catId) => {
    const val = (subInputs[catId] || '').trim();
    if (!val) return;
    addSubCategory(catId, val);
    setSubInputs(prev => ({ ...prev, [catId]: '' }));
  };

  return (
    <section className="tab-pane active" id="tab-categories">
      {/* Category Channel Filter Pills */}
      <div className="category-channel-filter-bar">
        <div className="category-channel-pills">
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

      {/* Toolbar */}
      <div className="table-toolbar category-toolbar" style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, minWidth: '260px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              id="categorySearchInput"
              placeholder="Search categories and subcategories..."
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
              onClick={onOpenAddCategory}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, whiteSpace: 'nowrap', padding: '10px 20px', background: 'var(--color-gold)', borderColor: 'var(--color-gold)', boxShadow: '0 2px 8px rgba(197, 157, 95, 0.3)' }}
            >
              <i className="fa-solid fa-folder-plus"></i> + Create New Category
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Categories List */}
      <div className="categories-management-container" id="categoriesManagementContainer" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredCategories.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888', background: '#fff', borderRadius: '8px', border: '1px dashed #dcd4c5' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '10px', display: 'inline-block' }}></i>
            <p>No categories found matching your filter.</p>
          </div>
        ) : (
          filteredCategories.map(cat => {
            const catProds = products.filter(p => (p.categoryId || '').toLowerCase() === cat.id.toLowerCase() || (p.category || '').toLowerCase() === cat.name.toLowerCase());
            const subs = cat.subCategories || [];

            return (
              <div
                key={cat.id}
                className="admin-category-section"
                style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #ede8df', paddingBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div
                      style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5d8c3', flexShrink: 0, cursor: 'pointer' }}
                      onClick={() => onEditCategory && onEditCategory(cat)}
                      title="Edit Category Details"
                    >
                      <img
                        src={cat.image || 'images/wooden-gallery.jpg'}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'images/wooden-gallery.jpg'; }}
                      />
                    </div>

                    <div>
                      <div className="cat-manage-meta-row" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span className={`cat-channel-tag tag-${cat.channel || 'shop'}`}>
                          {cat.channelName || (cat.channel || 'shop').toUpperCase()}
                        </span>
                        <span className="admin-cat-badge">{cat.badge || 'Collection'}</span>
                        <span className="admin-cat-count-pill">{catProds.length} Products</span>
                      </div>
                      <h3 className="cat-manage-name" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px' }}>
                        {cat.name}
                      </h3>
                      <p className="cat-manage-desc" style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        {cat.description || 'Artisanal collection items and decor.'}
                      </p>
                    </div>
                  </div>

                  <div className="cat-manage-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn-edit-cat"
                      onClick={() => onEditCategory && onEditCategory(cat)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit Category
                    </button>
                    <button
                      type="button"
                      className="btn-delete-cat"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i> Delete
                    </button>
                  </div>
                </div>

                {/* Subcategories Box */}
                <div className="cat-manage-body" style={{ paddingTop: '18px' }}>
                  <div className="cat-subcat-box">
                    <div className="cat-subcat-box-title-row">
                      <span className="cat-subcat-box-title">
                        <i className="fa-solid fa-tags" style={{ color: 'var(--color-gold)' }}></i>
                        Subtitle Categories ({subs.length})
                      </span>
                    </div>

                    <div className="cat-subcat-pills-wrap">
                      {subs.map((sub, sIdx) => {
                        const count = catProds.filter(p => (p.subItem || p.subCategory || '').toLowerCase() === sub.toLowerCase()).length;
                        return (
                          <span key={sIdx} className="manage-subcat-pill">
                            <span>{sub}</span>
                            <span className="manage-subcat-count">{count}</span>
                            <button
                              type="button"
                              className="manage-subcat-delete-btn"
                              title={`Delete subtitle "${sub}"`}
                              onClick={() => deleteSubCategory(cat.id, sub)}
                            >
                              &times;
                            </button>
                          </span>
                        );
                      })}

                      {/* Inline Add Subcategory */}
                      <div className="inline-subcat-form">
                        <input
                          type="text"
                          className="inline-subcat-input"
                          placeholder="+ Add subtitle category..."
                          value={subInputs[cat.id] || ''}
                          onChange={(e) => handleSubInputChange(cat.id, e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddSub(cat.id); }}
                        />
                        <button
                          type="button"
                          className="btn-inline-add-subcat"
                          onClick={() => handleAddSub(cat.id)}
                        >
                          <i className="fa-solid fa-plus"></i> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
