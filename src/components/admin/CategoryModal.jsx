import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function CategoryModal({ isOpen, onClose, editingCategory }) {
  const { addCategory, updateCategory, uploadImage } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    channel: 'shop',
    channelName: 'Shop Collections',
    badge: 'Artisan Collection',
    image: '',
    description: '',
    subCategoriesText: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        id: editingCategory.id,
        name: editingCategory.name || '',
        channel: editingCategory.channel || 'shop',
        channelName: editingCategory.channelName || 'Shop Collections',
        badge: editingCategory.badge || 'Artisan Collection',
        image: editingCategory.image || '',
        description: editingCategory.description || '',
        subCategoriesText: (editingCategory.subCategories || []).join(', ')
      });
    } else {
      setFormData({
        name: '',
        channel: 'shop',
        channelName: 'Shop Collections',
        badge: 'Artisan Collection',
        image: '',
        description: '',
        subCategoriesText: ''
      });
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const subs = formData.subCategoriesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const channelMap = {
      shop: 'Shop Collections',
      corporate: 'Corporate Gifting',
      wholesale: 'Wholesale B2B',
      export: 'Export & Global'
    };

    const payload = {
      ...formData,
      channelName: channelMap[formData.channel] || 'Shop Collections',
      subCategories: subs.length > 0 ? subs : ['Default Collection'],
      image: formData.image || 'images/wooden-gallery.jpg'
    };

    if (editingCategory) {
      updateCategory(payload);
    } else {
      addCategory(payload);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop active" id="categoryModal" style={{ display: 'flex' }}>
      <div className="modal-dialog">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-header">
          <h3 id="categoryModalTitle">
            {editingCategory ? 'Edit Product Category' : 'Add New Product Category'}
          </h3>
          <p>This category will automatically synchronize and appear across both Admin and Customer Storefront.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newCatName">Category Name <span className="required-star" style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                id="newCatName"
                required
                placeholder="e.g. Brass & Metal Crafts"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="newCatChannel">Channel / Department <span className="required-star" style={{ color: '#dc2626' }}>*</span></label>
              <select
                id="newCatChannel"
                required
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              >
                <option value="shop">Shop Collections (Storefront)</option>
                <option value="corporate">Corporate Gifting (B2B)</option>
                <option value="wholesale">Wholesale (Domestic Bulk)</option>
                <option value="export">Export &amp; Global Sourcing</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newCatBadge">Category Badge / Tag</label>
              <input
                type="text"
                id="newCatBadge"
                placeholder="e.g. Master Artisan Series"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Cover Photo</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="images/wooden-gallery.jpg or URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fa-solid fa-camera"></i> Upload
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newCatSubs">Initial Subtitle Categories (Comma-separated)</label>
            <input
              type="text"
              id="newCatSubs"
              placeholder="e.g. Urn Lamps, Teak Clocks, Hand Carved Wall Panels"
              value={formData.subCategoriesText}
              onChange={(e) => setFormData({ ...formData, subCategoriesText: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newCatDesc">Short Description</label>
            <textarea
              id="newCatDesc"
              rows="3"
              placeholder="Brief description of the artisanal disciplines and craft tradition..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff', fontWeight: 700 }}>
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
