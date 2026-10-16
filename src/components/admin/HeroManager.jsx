import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function HeroManager() {
  const { heroData, saveHeroData, uploadImage, showAdminToast } = useAdmin();
  const [formData, setFormData] = useState({ ...heroData });

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        const finalUrl = await uploadImage(base64);
        setFormData(prev => ({ ...prev, image: finalUrl }));
        showAdminToast('Hero photo uploaded!');
      } catch (err) {
        setFormData(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    setFormData(prev => ({ ...prev, image: 'images/hero.jpg' }));
    showAdminToast('Hero photo reset to default.');
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveHeroData(formData);
    showAdminToast('Hero banner changes published live!');
  };

  const currentBg = formData.image || 'images/hero.jpg';

  return (
    <section className="tab-pane active" id="tab-hero">
      {/* Top Header Card */}
      <div
        className="card-mgmt-header"
        style={{
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #ebe4d8',
          padding: '22px 28px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.45rem', margin: 0 }}>
              Homepage Hero Banner &amp; Content
            </h3>
            <span
              className="badge"
              style={{ background: '#e8efe9', color: '#173b2c', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem' }}
            >
              Live Frontpage Display
            </span>
          </div>
          <p style={{ color: '#666', margin: 0, fontSize: '0.92rem' }}>
            Update the homepage hero background photo, headline, tagline, description, and call-to-action buttons. Any saved change syncs automatically to the live customer storefront in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href="/#home"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
            style={{ background: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Live Store
          </a>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff' }}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> Save Hero Changes
          </button>
        </div>
      </div>

      {/* 2-Column Split: Interactive Live Preview & Form Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '26px', alignItems: 'start' }}>
        {/* Left: Live Interactive Preview Card */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2dbcf', overflow: 'hidden', boxShadow: '0 4px 16px rgba(23,59,44,0.06)', position: 'sticky', top: '90px' }}>
          <div style={{ padding: '14px 20px', background: '#faf7f0', borderBottom: '1px solid #ebe4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              <i className="fa-solid fa-eye"></i> Live Interactive Preview
            </span>
            <span style={{ fontSize: '0.75rem', color: '#666', background: '#fff', border: '1px solid #e2dbcf', padding: '2px 8px', borderRadius: '6px' }}>
              Real-Time Updates
            </span>
          </div>

          {/* Miniature Storefront Hero Banner */}
          <div style={{ position: 'relative', width: '100%', minHeight: '420px', background: '#112019', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            {/* Background Image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${currentBg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.3s ease'
              }}
            ></div>

            {/* Dark luxury gradient overlay matching storefront */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(17,32,25,0.92) 0%, rgba(17,32,25,0.76) 50%, rgba(17,32,25,0.40) 100%)' }}></div>

            {/* Content Overlay */}
            <div style={{ position: 'relative', zIndex: 2, padding: '32px 28px', maxWidth: '540px', color: '#fff' }}>
              <span style={{ display: 'inline-block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1.8px', textTransform: 'uppercase', marginBottom: '10px' }}>
                {formData.eyebrow || 'ARTISANAL EXCELLENCE • DIRECT FROM INDIA'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', lineHeight: 1.2, fontWeight: 600, color: '#ffffff', margin: '0 0 14px 0', letterSpacing: '0.5px', whiteSpace: 'pre-line' }}>
                {formData.title || 'CRAFTED BY ARTISANS.\nINSPIRED BY INDIA.\nMADE MEANINGFUL.'}
              </h2>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0' }}>
                {formData.description || 'Discover thoughtfully crafted home décor and meaningful gifts that celebrate Indian craftsmanship.'}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button type="button" className="btn btn-primary btn-sm" style={{ pointerEvents: 'none', fontWeight: 700, letterSpacing: '0.6px', background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff' }}>
                  {formData.primaryBtnText || 'SHOP COLLECTIONS'}
                </button>
                <button type="button" className="btn btn-outline btn-sm" style={{ pointerEvents: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', borderColor: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.6px' }}>
                  {formData.secondaryBtnText || 'REQUEST A PROPOSAL'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content Editor Form */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2dbcf', padding: '24px 26px', boxShadow: '0 3px 12px rgba(23,59,44,0.06)', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* 1. Background Image */}
          <div style={{ borderBottom: '1px solid #f0ece3', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                <i className="fa-solid fa-image"></i> Hero Background Photograph
              </label>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleResetPhoto}
                style={{ padding: '3px 9px', fontSize: '0.75rem', background: '#fff' }}
              >
                <i className="fa-solid fa-rotate-left"></i> Reset to Default
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#666', margin: '0 0 12px 0' }}>
              Upload a high-resolution interior/lifestyle photograph or specify a URL.
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label
                className="btn btn-primary btn-sm"
                style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff' }}
              >
                <i className="fa-solid fa-camera"></i> Replace Background Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#777', marginBottom: '4px' }}>Image Path or URL</label>
              <input
                type="text"
                className="form-control"
                style={{ fontSize: '0.82rem', width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                placeholder="e.g. images/hero.jpg or URL"
                value={formData.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
              />
            </div>
          </div>

          {/* 2. Tagline / Eyebrow */}
          <div style={{ borderBottom: '1px solid #f0ece3', paddingBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
              Tagline / Eyebrow Text
            </label>
            <input
              type="text"
              style={{ fontWeight: 600, width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
              value={formData.eyebrow || ''}
              onChange={(e) => handleFieldChange('eyebrow', e.target.value)}
              placeholder="e.g. ARTISANAL EXCELLENCE • DIRECT FROM INDIA"
            />
          </div>

          {/* 3. Headline / Title */}
          <div style={{ borderBottom: '1px solid #f0ece3', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                Main Headline
              </label>
              <span style={{ fontSize: '0.73rem', color: '#888' }}>Press Enter for line breaks</span>
            </div>
            <textarea
              rows="3"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.35, color: 'var(--color-primary)', width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
              value={formData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Enter main heading lines..."
            ></textarea>
          </div>

          {/* 4. Subtitle / Description */}
          <div style={{ borderBottom: '1px solid #f0ece3', paddingBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
              Description / Subtitle
            </label>
            <textarea
              rows="3"
              style={{ fontSize: '0.88rem', lineHeight: 1.5, width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
              value={formData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Enter introductory paragraph..."
            ></textarea>
          </div>

          {/* 5. Call to Action Buttons */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
              Call-to-Action Buttons
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#faf8f5', border: '1px solid #ebe4d8', borderRadius: '8px', padding: '12px 14px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Primary Button
                </span>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#666', marginBottom: '3px' }}>Button Label</label>
                  <input
                    type="text"
                    style={{ fontSize: '0.82rem', width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    value={formData.primaryBtnText || ''}
                    onChange={(e) => handleFieldChange('primaryBtnText', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#666', marginBottom: '3px' }}>Link / Destination</label>
                  <input
                    type="text"
                    style={{ fontSize: '0.82rem', width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    value={formData.primaryBtnLink || ''}
                    onChange={(e) => handleFieldChange('primaryBtnLink', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ background: '#faf8f5', border: '1px solid #ebe4d8', borderRadius: '8px', padding: '12px 14px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Secondary Button
                </span>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#666', marginBottom: '3px' }}>Button Label</label>
                  <input
                    type="text"
                    style={{ fontSize: '0.82rem', width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    value={formData.secondaryBtnText || ''}
                    onChange={(e) => handleFieldChange('secondaryBtnText', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#666', marginBottom: '3px' }}>Link / Destination</label>
                  <input
                    type="text"
                    style={{ fontSize: '0.82rem', width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    value={formData.secondaryBtnLink || ''}
                    onChange={(e) => handleFieldChange('secondaryBtnLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div style={{ marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff' }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Save Hero Changes &amp; Publish Live
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
