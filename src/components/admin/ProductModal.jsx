import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { normalizeCategoryId } from '../../utils/formatters';

const PRESET_PHOTOS = [
  { value: 'images/artisan-gallery.jpg', label: 'Pottery' },
  { value: 'images/wooden-gallery.jpg', label: 'Wooden' },
  { value: 'images/terracotta-pot.jpg', label: 'Clay Pot' },
  { value: 'images/grass-basket.jpg', label: 'Grass Basket' },
  { value: 'images/hero.jpg', label: 'Lamp' },
  { value: 'images/premium-decor.jpg', label: 'Decor' },
  { value: 'images/personalization.jpg', label: 'Keepsake' },
  { value: 'images/esg-corporate.jpg', label: 'ESG Box' },
  { value: 'images/corporate-lifestyle.jpg', label: 'Corporate' },
  { value: 'images/global-sourcing.jpg', label: 'Export' },
  { value: 'images/wholesale.jpg', label: 'Wholesale' },
  { value: 'images/sustainability-crafts.jpg', label: 'Eco Crafts' }
];

export default function ProductModal({ isOpen, onClose, editingProduct, initialCategory, initialSubCategory }) {
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
    badge: 'Artisan Signature',
    image: '',
    description: '',
    outOfStock: false
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [customSubItem, setCustomSubItem] = useState('');

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
        badge: editingProduct.badge || 'Artisan Signature',
        image: editingProduct.image || '',
        description: editingProduct.description || '',
        outOfStock: Boolean(editingProduct.outOfStock)
      });
      setImagePreview(editingProduct.image || '');
      setCustomSubItem('');
    } else {
      const defaultCat = initialCategory
        ? categories.find(c => c.name.toLowerCase() === initialCategory.toLowerCase() || c.id === initialCategory)
        : categories[0];

      const catName = defaultCat ? defaultCat.name : 'Artisan Gallery';
      const catId = defaultCat ? defaultCat.id : 'artisan-gallery';
      const catChannel = defaultCat ? (defaultCat.channel || 'shop') : 'shop';
      const defaultSub = initialSubCategory || (defaultCat?.subCategories?.[0] || 'Handcrafted');

      setFormData({
        title: '',
        category: catName,
        categoryId: catId,
        channel: catChannel,
        subItem: defaultSub,
        price: '',
        mrp: '',
        origin: 'Jaipur, Rajasthan',
        material: 'Terracotta & Teakwood',
        badge: 'Artisan Signature',
        image: '',
        description: '',
        outOfStock: false
      });
      setImagePreview('');
      setCustomSubItem('');
    }
  }, [editingProduct, isOpen, initialCategory, initialSubCategory, categories]);

  if (!isOpen) return null;

  const currentCategoryObj = categories.find(c => c.name === formData.category || c.id === formData.categoryId) || categories[0];
  const subs = currentCategoryObj?.subCategories || ['Handcrafted'];

  const handleCategoryChange = (catName) => {
    const found = categories.find(c => c.name === catName) || categories[0];
    setFormData(prev => ({
      ...prev,
      category: found.name,
      categoryId: found.id,
      channel: found.channel || 'shop',
      subItem: found.subCategories?.[0] || 'Handcrafted'
    }));
  };

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

  const handlePresetSelect = (presetUrl) => {
    setImagePreview(presetUrl);
    setFormData(prev => ({ ...prev, image: presetUrl }));
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a product title.');
      return;
    }

    const finalSub = customSubItem.trim() ? customSubItem.trim() : formData.subItem;

    const payload = {
      ...formData,
      subItem: finalSub,
      image: formData.image || imagePreview || 'images/wooden-gallery.jpg',
      price: Number(formData.price) || 0,
      mrp: formData.mrp ? Number(formData.mrp) : undefined
    };

    if (editingProduct) {
      updateProduct(payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  const mrpNum = Number(formData.mrp) || 0;
  const priceNum = Number(formData.price) || 0;
  const savings = mrpNum > priceNum ? mrpNum - priceNum : 0;
  const savingsPct = mrpNum > 0 ? Math.round((savings / mrpNum) * 100) : 0;

  return (
    <div className="modal-backdrop active" id="productModal" style={{ display: 'flex' }}>
      <div className="modal-dialog" style={{ maxWidth: '720px' }}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-header">
          <h3 id="productModalTitle">{editingProduct ? 'Edit Product Creation' : 'Add Product'}</h3>
          <p>Handcrafted artisan creation automatically assigned to its dedicated category.</p>

          <div className="modal-assigned-category-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#faf7f0', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e5dfd3', marginTop: '10px', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-layer-group" style={{ color: 'var(--color-gold)' }}></i>
            <span style={{ color: '#666' }}>Main Category:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{formData.category}</strong>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: '#666' }}>Subtitle:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{customSubItem || formData.subItem}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category & Subtitle Selectors */}
          <div className="form-row" style={{ marginBottom: '14px', background: '#faf9f5', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px', display: 'block' }}>
                Main Category <span className="required-star" style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                style={{ fontWeight: 600, padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%', background: '#fff', fontSize: '0.95rem' }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.channelName || c.channel})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px', display: 'block' }}>
                Subtitle Category <span className="required-star" style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.subItem}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, subItem: e.target.value }));
                  setCustomSubItem('');
                }}
                style={{ fontWeight: 600, padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%', background: '#fff', fontSize: '0.95rem' }}
              >
                {subs.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or enter custom subtitle category name..."
                value={customSubItem}
                onChange={(e) => setCustomSubItem(e.target.value)}
                style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Product Name */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="prodTitle">Product Name <span className="required-star" style={{ color: '#dc2626' }}>*</span></label>
            <input
              type="text"
              id="prodTitle"
              required
              placeholder="e.g. Ambient Brass & Teak Table Lamp"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Pricing */}
          <div className="form-row pricing-form-row">
            <div className="form-group">
              <label htmlFor="prodMrp">MRP (₹ INR) <span style={{ fontSize: '0.75rem', color: '#888' }}>(Optional)</span></label>
              <input
                type="number"
                id="prodMrp"
                min="0"
                placeholder="e.g. 3999"
                value={formData.mrp}
                onChange={(e) => setFormData(prev => ({ ...prev, mrp: e.target.value }))}
              />
              <span className="field-sub-hint" style={{ fontSize: '0.73rem', color: '#888' }}>Original / Maximum Retail Price</span>
            </div>

            <div className="form-group">
              <label htmlFor="prodPrice">Discount Price (₹ INR) <span style={{ fontSize: '0.75rem', color: '#888' }}>(Optional)</span></label>
              <input
                type="number"
                id="prodPrice"
                min="0"
                placeholder="e.g. 2999"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
              <span className="field-sub-hint" style={{ fontSize: '0.73rem', color: '#888' }}>Offer / Selling Price (Customer pays)</span>
            </div>
          </div>

          {savings > 0 && (
            <div className="discount-savings-calc" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px' }}>
              <i className="fa-solid fa-tags" style={{ marginRight: '6px' }}></i>
              Customer saves ₹{savings.toLocaleString('en-IN')} ({savingsPct}% OFF)
            </div>
          )}

          {/* Photo Upload Dropzone */}
          <div className="form-group photo-upload-group" style={{ marginBottom: '18px' }}>
            <label className="photo-section-heading" style={{ display: 'block', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Product Photo / Image <span style={{ color: '#dc2626' }}>*</span></span>
              <span style={{ display: 'block', fontSize: '0.78rem', color: '#777' }}>Directly choose photo from your computer or select from curated craft presets below</span>
            </label>

            <div
              className="photo-upload-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropFile}
              style={{ border: '2px dashed #ded8cb', borderRadius: '10px', padding: '24px', textAlign: 'center', background: '#faf9f6', position: 'relative' }}
            >
              <input
                type="file"
                id="modalFileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="photo-preview-wrap">
                  <div className="preview-img-container" style={{ position: 'relative', width: '180px', height: '140px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'images/wooden-gallery.jpg'; }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.7rem', padding: '2px 0' }}>
                      Selected Photo
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => document.getElementById('modalFileInput').click()}
                      style={{ background: '#fff', border: '1px solid #ccc', fontSize: '0.8rem', fontWeight: 600, padding: '5px 12px' }}
                    >
                      <i className="fa-solid fa-camera-rotate"></i> Change Photo
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => { setImagePreview(''); setFormData(prev => ({ ...prev, image: '' })); }}
                      style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                    >
                      <i className="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="dropzone-prompt"
                  onClick={() => document.getElementById('modalFileInput').click()}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '2.2rem', color: 'var(--color-gold)', marginBottom: '8px' }}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--color-primary)' }}>
                    Click to Upload Photo from Your Device
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                    Or drag &amp; drop photo directly here (JPG, PNG, WEBP)
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: '12px', background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff', fontWeight: 700, padding: '7px 18px' }}
                  >
                    <i className="fa-solid fa-folder-open"></i> Choose Photo File
                  </button>
                </div>
              )}

              {isUploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing image...
                </div>
              )}
            </div>

            {/* Quick Preset Photos Picker */}
            <div className="preset-picker-section" style={{ marginTop: '14px' }}>
              <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#666', marginBottom: '8px' }}>
                Or Pick from Curated Craft Gallery (12 Real Photos):
              </span>
              <div className="image-preset-picker" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px' }}>
                {PRESET_PHOTOS.map((p, idx) => (
                  <label
                    key={idx}
                    className="img-radio-label"
                    style={{
                      border: imagePreview === p.value ? '2px solid var(--color-gold)' : '1px solid #ded8cb',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: '#fff',
                      padding: '2px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      type="radio"
                      name="presetImg"
                      value={p.value}
                      checked={imagePreview === p.value}
                      onChange={() => handlePresetSelect(p.value)}
                      style={{ display: 'none' }}
                    />
                    <img src={p.value} alt={p.label} style={{ width: '100%', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#555', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Badge & Stock */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prodBadge">Product Badge / Tag</label>
              <select
                id="prodBadge"
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
              >
                <option value="Artisan Signature">Artisan Signature</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Eco Certified">Eco Certified</option>
                <option value="Limited Edition">Limited Edition</option>
                <option value="Generational Craft">Generational Craft</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Curator Choice">Curator Choice</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="prodStockStatus">Stock Availability</label>
              <select
                id="prodStockStatus"
                value={formData.outOfStock ? 'out' : 'in'}
                onChange={(e) => setFormData(prev => ({ ...prev, outOfStock: e.target.value === 'out' }))}
                style={{ fontWeight: 600 }}
              >
                <option value="in">🟢 In Stock (Active &amp; Available)</option>
                <option value="out">🔴 Out of Stock (Disabled)</option>
              </select>
            </div>
          </div>

          {/* Origin & Materials */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prodOrigin">Craft Origin &amp; Cluster</label>
              <input
                type="text"
                id="prodOrigin"
                placeholder="e.g. Saharanpur, Uttar Pradesh"
                value={formData.origin}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="prodMaterial">Materials Specification</label>
              <input
                type="text"
                id="prodMaterial"
                placeholder="e.g. Solid Indian Teak, Brass Hands"
                value={formData.material}
                onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label htmlFor="prodDesc">Product Description</label>
            <textarea
              id="prodDesc"
              rows="3"
              placeholder="Describe the artisan craft techniques, generational discipline, and tactile details..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="saveProductBtn"
              disabled={isUploading}
              style={{ background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff', fontWeight: 700 }}
            >
              {editingProduct ? 'Save Changes' : 'Save Product to Live Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
