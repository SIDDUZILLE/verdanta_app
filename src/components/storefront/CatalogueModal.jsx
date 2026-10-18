import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function CatalogueModal() {
  const { isCatalogueModalOpen, closeCatalogueModal, showToast } = useStore();

  if (!isCatalogueModalOpen) return null;

  const simulateDownload = (filename, title) => {
    showToast(`Downloading ${title}...`);
    setTimeout(() => {
      alert(`Lookbook "${title}" (${filename}) prepared!\n\nThank you for exploring Verdanta World catalogues. Our desk has logged your interest.`);
    }, 400);
  };

  return (
    <div className="modal-backdrop active" id="catalogueModal">
      <div className="modal-dialog">
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeCatalogueModal}
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-header">
          <span className="modal-eyebrow">GLOBAL EXPORT &amp; WHOLESALE</span>
          <h3>Download Verdanta World Full Catalogues</h3>
          <p>Access our high-resolution export sheets, material specifications, and wholesale pricing schedules.</p>
        </div>

        <div className="catalogue-options-list">
          <div className="catalogue-item">
            <div className="catalogue-icon">
              <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div className="catalogue-info">
              <strong>2026 Master Artisan &amp; Home Décor Catalogue</strong>
              <span>PDF • 48 Pages • High-Res Photos &amp; Artisan Cluster Profiles</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => simulateDownload('Master_Artisan_Catalogue_2026.pdf', 'Master Artisan Catalogue 2026')}
            >
              <i className="fa-solid fa-download"></i> Download
            </button>
          </div>

          <div className="catalogue-item">
            <div className="catalogue-icon">
              <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div className="catalogue-info">
              <strong>ESG Corporate Gifting &amp; Customization Lookbook</strong>
              <span>PDF • 24 Pages • Gift Kits, Seed Paper &amp; Sustainable Hampers</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => simulateDownload('ESG_Corporate_Gifting_2026.pdf', 'ESG Corporate Gifting Lookbook')}
            >
              <i className="fa-solid fa-download"></i> Download
            </button>
          </div>

          <div className="catalogue-item">
            <div className="catalogue-icon">
              <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div className="catalogue-info">
              <strong>Export &amp; International Logistics Guide</strong>
              <span>PDF • 18 Pages • FOB/CIF Pricing, MOQs, Packaging &amp; Compliance</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => simulateDownload('Export_International_Logistics_Guide_2026.pdf', 'Export Logistics Guide')}
            >
              <i className="fa-solid fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
