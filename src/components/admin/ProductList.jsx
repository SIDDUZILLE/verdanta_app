import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice, normalizeCategoryId } from '../../utils/formatters';

export default function ProductList({ onOpenAdd, onEditProduct }) {
  const { products, categories, deleteProduct } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all') {
        const pCat = p.categoryId || normalizeCategoryId(p.category);
        if (pCat !== selectedCategory) return false;
      }

      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const titleMatch = (p.title || p.name || '').toLowerCase().includes(q);
        const subMatch = (p.subItem || p.subCategory || '').toLowerCase().includes(q);
        const matMatch = (p.material || '').toLowerCase().includes(q);
        if (!titleMatch && !subMatch && !matMatch) return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleDelete = (p) => {
    if (window.confirm(`Are you sure you want to delete "${p.title || p.name}" from the store catalog?`)) {
      deleteProduct(p.id);
    }
  };

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <div>
          <h3>Store Catalog & Inventory ({products.length} Items)</h3>
          <p>Add, edit, manage photos, and update pricing across all collections.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenAdd}
        >
          <i className="fa-solid fa-plus"></i> Add New Creation
        </button>
      </div>

      {/* Catalog Controls */}
      <div className="admin-catalog-controls">
        <div className="admin-search-wrap">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by title, craft type, or material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <select
          className="admin-cat-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Collections ({products.length})</option>
          {categories.map(c => {
            const count = products.filter(p => p.categoryId === c.id || p.category === c.name).length;
            return (
              <option key={c.id} value={c.id}>
                {c.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Products Table */}
      <div className="admin-table-responsive">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Creation Details</th>
              <th>Collection</th>
              <th>Sub-Category</th>
              <th>Selling Price</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td style={{ width: '60px' }}>
                  <img
                    src={p.image || 'images/wooden-gallery.jpg'}
                    alt={p.title || p.name}
                    className="admin-product-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'images/wooden-gallery.jpg';
                    }}
                  />
                </td>
                <td>
                  <strong className="admin-prod-title">{p.title || p.name}</strong>
                  <div className="admin-prod-meta">
                    {p.material && <span>{p.material} &bull; </span>}
                    <span>{p.origin || 'India'}</span>
                  </div>
                </td>
                <td>
                  <span className="badge-category">{p.category}</span>
                </td>
                <td>{p.subItem || p.subCategory || 'Handcrafted'}</td>
                <td>
                  <strong style={{ color: 'var(--color-primary)' }}>{formatPrice(p.price)}</strong>
                  {p.mrp && Number(p.mrp) > Number(p.price) && (
                    <div style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: '#888' }}>
                      ₹{Number(p.mrp).toLocaleString('en-IN')}
                    </div>
                  )}
                </td>
                <td>
                  {p.outOfStock ? (
                    <span className="badge-stock out-of-stock">Out of Stock</span>
                  ) : (
                    <span className="badge-stock in-stock">In Stock</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      title="Edit Creation"
                      onClick={() => onEditProduct(p)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      title="Delete Creation"
                      onClick={() => handleDelete(p)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
