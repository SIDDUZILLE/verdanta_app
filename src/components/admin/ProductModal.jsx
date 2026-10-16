import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { normalizeCategoryId } from '../../utils/formatters';

export default function ProductModal({ isOpen, onClose, editingProduct }) {
  const { categories, addProduct, updateProduct, uploadImage } = useAdmin();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Artisan Gallery',
    categoryId: 'artisan-gallery',
    channel: 'shop',
    subItem: 'Lamps & Ambient Lighting',
    price: '',
    mrp: '',
    origin: 'Jaipur, Rajasthan',
    material: 'Terracotta & Teakwood',
    badge: 'Artisan Crafted',
    image: '',
    description: '',
    outOfStock: false
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        title: editingProduct.title || editingProduct.name || '',
        category: editingProduct.category || 'Artisan Gallery',
        categoryId: editingProduct.categoryId || normalizeCategoryId(editingProduct.category),
        channel: editingProduct.channel || 'shop',
        subItem: editingProduct.subItem || editingProduct.subCategory || '',
        price: editingProduct.price || '',
        mrp: editingProduct.mrp || '',
        origin: editingProduct.origin || editingProduct.craftOrigin || 'Jaipur, Rajasthan',
        material: editingProduct.material || 'Terracotta & Teakwood',
        badge: editingProduct.badge || '',
        image: editingProduct.image || '',
        description: editingProduct.description || '',
        outOfStock: Boolean(editingProduct.outOfStock)
      });
      setImagePreview(editingProduct.image || '');
    } else {
      setFormData({
        title: '',
        category: 'Artisan Gallery',
        categoryId: 'artisan-gallery',
        channel: 'shop',
        subItem: 'Lamps & Ambient Lighting',
        price: '',
        mrp: '',
        origin: 'Jaipur, Rajasthan',
        material: 'Terracotta & Teakwood',
        badge: 'Artisan Crafted',
        image: '',
        description: '',
        outOfStock: false
      });
      setImagePreview('');
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setImagePreview(base64);
      setIsUploading(true);
      try {
        const finalUrl = await uploadImage(base64);
        setFormData(prev => ({ ...prev, image: finalUrl }));
      } catch (err) {
        setFormData(prev => ({ ...prev, image: base64 }));
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (catName) => {
    const foundCat = categories.find(c => c.name === catName) || categories[0];
    setFormData(prev => ({
      ...prev,
      category: foundCat.name,
      categoryId: foundCat.id,
      channel: foundCat.channel || 'shop',
      subItem: foundCat.subCategories?.[0] || 'Handcrafted'
    }));
  };

  const currentCategory = categories.find(c => c.name === formData.category) || categories[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a creation title.');
      return;
    }

    const payload = {
      ...formData,
      image: formData.image || imagePreview || 'images/wooden-gallery.jpg'
    };

    if (editingProduct) {
      updateProduct(payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop active" id="adminProductModal">
      <div className="modal-dialog modal-dialog-lg">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <span className="modal-eyebrow">CATALOG INVENTORY MANAGER</span>
        <h2 className="modal-title">
          {editingProduct ? 'Edit Artisan Creation' : 'Add New Artisan Creation'}
        </h2>

        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="admin-form-two-cols">
            {/* Left Col: Details */}
            <div className="admin-form-col">
              <div className="form-group">
                <label>Creation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculpted Terracotta Urn Lamp"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Primary Collection *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.channelName || c.channel})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sub-Category / Craft Type</label>
                  {currentCategory?.subCategories?.length > 0 ? (
                    <select
                      value={formData.subItem}
                      onChange={(e) => setFormData({ ...formData, subItem: e.target.value })}
                    >
                      {currentCategory.subCategories.map((sub, sIdx) => (
                        <option key={sIdx} value={sub}>{sub}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.subItem}
                      onChange={(e) => setFormData({ ...formData, subItem: e.target.value })}
                      placeholder="e.g. Handmade Décor"
                    />
                  )}
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>MRP / Strikethrough (₹)</label>
                  <input
                    type="number"
                    placeholder="3499"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Craft Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Primary Materials</label>
                  <input
                    type="text"
                    placeholder="e.g. Teakwood & Terracotta"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Story</label>
                <textarea
                  rows="3"
                  placeholder="Detail the craft heritage, artisan background, and dimensions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.outOfStock}
                    onChange={(e) => setFormData({ ...formData, outOfStock: e.target.checked })}
                  />
                  <span>Mark as Out of Stock (Displays inquiry badge instead of instant purchase)</span>
                </label>
              </div>
            </div>

            {/* Right Col: Photo Upload */}
            <div className="admin-form-col photo-col">
              <label className="photo-label">Product Imagery</label>

              <div className="image-preview-box">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="uploaded-photo-preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'images/wooden-gallery.jpg';
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>No image uploaded</span>
                  </div>
                )}
                {isUploading && (
                  <div className="uploading-overlay">
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing image...
                  </div>
                )}
              </div>

              <div className="upload-btn-wrap">
                <label className="btn btn-secondary btn-block file-upload-label">
                  <i className="fa-solid fa-image"></i> Choose Photo File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Or Image URL / Relative Path</label>
                <input
                  type="text"
                  placeholder="images/wooden-gallery.jpg or https://..."
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label>Card Highlight Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Masterwork 01, Bestseller, Heirloom"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              <i className="fa-solid fa-check"></i> {editingProduct ? 'Save Changes' : 'Publish Creation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
