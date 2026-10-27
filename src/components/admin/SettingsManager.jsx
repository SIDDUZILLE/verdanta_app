import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function SettingsManager() {
  const { config, saveConfig } = useAdmin();

  const [formData, setFormData] = useState({
    whatsapp_number: config.whatsapp_number || '918867688699',
    contact_email: config.contact_email || 'info@verdantaworld.com',
    admin_username: config.admin_username || 'admin',
    admin_password: config.admin_password || 'Verdanta@Admin2026',
    mongodb_uri: config.mongodb_uri || ''
  });

  React.useEffect(() => {
    if (config) {
      setFormData(prev => ({
        ...prev,
        whatsapp_number: config.whatsapp_number || prev.whatsapp_number,
        contact_email: config.contact_email || prev.contact_email,
        admin_username: config.admin_username || prev.admin_username,
        admin_password: config.admin_password || prev.admin_password,
        mongodb_uri: config.mongodb_uri !== undefined ? config.mongodb_uri : prev.mongodb_uri
      }));
    }
  }, [config]);

  const [cloudinaryName, setCloudinaryName] = useState(
    localStorage.getItem('verdanta_cloudinary_cloud_name') || ''
  );
  const [cloudinaryPreset, setCloudinaryPreset] = useState(
    localStorage.getItem('verdanta_cloudinary_upload_preset') || ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig(formData);

    // Save Cloudinary settings to localStorage
    localStorage.setItem('verdanta_cloudinary_cloud_name', cloudinaryName.trim());
    localStorage.setItem('verdanta_cloudinary_upload_preset', cloudinaryPreset.trim());

    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <div>
          <h3>Store & Platform Settings</h3>
          <p>Configure WhatsApp order recipient, admin security, database credentials, and Cloudinary storage.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-settings-form">
        {/* WhatsApp & Concierge */}
        <div className="settings-group">
          <h4><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp Order Recipient</h4>
          <p className="settings-desc">
            Customer bag checkouts and proposal inquiries will be automatically directed to this WhatsApp number. Include country code without '+' (e.g. 918867688699).
          </p>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input
              type="text"
              required
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            />
          </div>
        </div>

        {/* Official Store Contact Email */}
        <div className="settings-group">
          <h4><i className="fa-solid fa-envelope" style={{ color: 'var(--color-primary)' }}></i> Official Contact & Support Email</h4>
          <p className="settings-desc">
            This email address is shown in the footer and across the store. When visitors click the email link, it opens Gmail directly with your address pre-filled as recipient.
          </p>
          <div className="form-group">
            <label>Official Contact Email</label>
            <input
              type="email"
              required
              placeholder="e.g. info@verdantaworld.com"
              value={formData.contact_email || ''}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
          </div>
        </div>

        {/* Security & Access */}
        <div className="settings-group">
          <h4><i className="fa-solid fa-lock" style={{ color: 'var(--color-primary)' }}></i> Admin Credentials</h4>
          <div className="form-group-row">
            <div className="form-group">
              <label>Admin Username</label>
              <input
                type="text"
                required
                value={formData.admin_username}
                onChange={(e) => setFormData({ ...formData, admin_username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Admin Master Password</label>
              <input
                type="text"
                required
                value={formData.admin_password}
                onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Cloudinary CDN Storage */}
        <div className="settings-group">
          <h4><i className="fa-solid fa-cloud" style={{ color: '#0284c7' }}></i> Cloudinary Cloud Storage (Optional)</h4>
          <p className="settings-desc">
            Upload product photos directly to your Cloudinary media library for global CDN delivery. Leave blank to use local storage.
          </p>
          <div className="form-group-row">
            <div className="form-group">
              <label>Cloudinary Cloud Name</label>
              <input
                type="text"
                placeholder="e.g. my-verdanta-store"
                value={cloudinaryName}
                onChange={(e) => setCloudinaryName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Unsigned Upload Preset</label>
              <input
                type="text"
                placeholder="e.g. verdanta_preset"
                value={cloudinaryPreset}
                onChange={(e) => setCloudinaryPreset(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* MongoDB Sync */}
        <div className="settings-group">
          <h4><i className="fa-solid fa-database" style={{ color: '#10b981' }}></i> MongoDB Connection (Backend Sync)</h4>
          <div className="form-group">
            <label>MongoDB URI</label>
            <input
              type="password"
              placeholder="mongodb+srv://user:password@cluster.mongodb.net/..."
              value={formData.mongodb_uri}
              onChange={(e) => setFormData({ ...formData, mongodb_uri: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-check"></i> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
