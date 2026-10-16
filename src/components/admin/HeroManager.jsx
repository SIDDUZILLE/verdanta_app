import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function HeroManager() {
  const { heroData, saveHeroData, uploadImage } = useAdmin();
  const [formData, setFormData] = useState({ ...heroData });
  const [imagePreview, setImagePreview] = useState(heroData.image || heroData.defaultImage || 'images/hero.jpg');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    saveHeroData(formData);
  };

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <div>
          <h3>Storefront Hero Banner CMS</h3>
          <p>Customize the main hero title, eyebrow text, imagery, and call-to-action buttons.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-hero-form">
        <div className="admin-form-two-cols">
          <div className="admin-form-col">
            <div className="form-group">
              <label>Eyebrow Tagline</label>
              <input
                type="text"
                value={formData.eyebrow || ''}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                placeholder="ARTISANAL EXCELLENCE • DIRECT FROM INDIA"
              />
            </div>

            <div className="form-group">
              <label>Hero Headline (Supports multiple lines)</label>
              <textarea
                rows="3"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="CRAFTED BY ARTISANS.&#10;INSPIRED BY INDIA.&#10;MADE MEANINGFUL."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Subtitle / Brand Narrative</label>
              <textarea
                rows="3"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Primary Button Text</label>
                <input
                  type="text"
                  value={formData.primaryBtnText || ''}
                  onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                  placeholder="SHOP COLLECTIONS"
                />
              </div>
              <div className="form-group">
                <label>Primary Button Link</label>
                <input
                  type="text"
                  value={formData.primaryBtnLink || ''}
                  onChange={(e) => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                  placeholder="#categories"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Secondary Button Text</label>
                <input
                  type="text"
                  value={formData.secondaryBtnText || ''}
                  onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                  placeholder="REQUEST A PROPOSAL"
                />
              </div>
              <div className="form-group">
                <label>Secondary Button Link</label>
                <input
                  type="text"
                  value={formData.secondaryBtnLink || ''}
                  onChange={(e) => setFormData({ ...formData, secondaryBtnLink: e.target.value })}
                  placeholder="modal:proposal"
                />
              </div>
            </div>
          </div>

          <div className="admin-form-col photo-col">
            <label className="photo-label">Hero Background Image</label>
            <div className="image-preview-box hero-preview-box">
              <img
                src={imagePreview}
                alt="Hero Preview"
                className="uploaded-photo-preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'images/hero.jpg';
                }}
              />
              {isUploading && (
                <div className="uploading-overlay">
                  <i className="fa-solid fa-spinner fa-spin"></i> Uploading...
                </div>
              )}
            </div>

            <label className="btn btn-secondary btn-block file-upload-label" style={{ marginTop: '12px' }}>
              <i className="fa-solid fa-upload"></i> Upload New Hero Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label>Image URL / Relative Path</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="images/hero.jpg"
              />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            <i className="fa-solid fa-floppy-disk"></i> Save Hero Changes
          </button>
        </div>
      </form>
    </div>
  );
}
