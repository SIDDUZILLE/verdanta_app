import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function WholesaleSection() {
  const { openProposalModal, setIsVisitModalOpen, showToast } = useStore();

  const handleDownloadCatalogue = (title) => {
    showToast(`Downloading ${title} Lookbook...`);
    setTimeout(() => {
      alert(`Lookbook "${title}" prepared!\n\nThank you for exploring Verdanta World export consignments. Our export desk has logged your interest.`);
    }, 500);
  };

  return (
    <>
      {/* Wholesale Section */}
      <section className="wholesale-section" id="wholesale">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-eyebrow">DOMESTIC & INTERNATIONAL BULK SUPPLY</span>
            <h2 className="section-title">Wholesale Indian Craft Collections</h2>
            <p className="section-desc">
              Direct atelier sourcing for boutique gift retailers, interior designers, museum shops, and hospitality brands. Handcrafted teakwood, solid brass statues, and ambient lighting at competitive tier-based wholesale pricing.
            </p>
          </div>

          <div className="wholesale-dual-grid">
            <div className="wholesale-card">
              <div
                className="wholesale-card-img"
                style={{ backgroundImage: `url("images/wooden-gallery.jpg")` }}
              >
                <span className="wholesale-pill">Wood Crafts</span>
              </div>
              <div className="wholesale-card-body">
                <h3>Artisanal Wooden Crafts (B2B)</h3>
                <p>
                  Carved clocks, traditional toys, tabletop tea-light holders, and handmade desk organizers crafted from seasoned Indian hardwoods.
                </p>
                <div className="wholesale-specs">
                  <span><i className="fa-solid fa-check"></i> Tiered MOQs (50+ units)</span>
                  <span><i className="fa-solid fa-check"></i> Custom Laser Monogramming</span>
                  <span><i className="fa-solid fa-check"></i> Direct Workshop Dispatch</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary wholesale-btn"
                  onClick={() => openProposalModal('Wholesale - Wood Crafts', 'Inquiry for wholesale wood crafts catalog and volume tiers.')}
                >
                  <i className="fa-solid fa-file-invoice"></i> Request Wood Price Matrix
                </button>
              </div>
            </div>

            <div className="wholesale-card">
              <div
                className="wholesale-card-img"
                style={{ backgroundImage: `url("images/wholesale.jpg")` }}
              >
                <span className="wholesale-pill">Metal & Brass</span>
              </div>
              <div className="wholesale-card-body">
                <h3>Solid Brass & Metal Crafts (B2B)</h3>
                <p>
                  Handcrafted solid brass deities, musician sets, hammered urlis, and heritage wall sconces forged by traditional metal artisans.
                </p>
                <div className="wholesale-specs">
                  <span><i className="fa-solid fa-check"></i> Premium Antique Patina & Polish</span>
                  <span><i className="fa-solid fa-check"></i> Protective Export Packaging</span>
                  <span><i className="fa-solid fa-check"></i> Certificate of Authenticity</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary wholesale-btn"
                  onClick={() => openProposalModal('Wholesale - Metal Crafts', 'Inquiry for wholesale metal crafts and bulk dealer catalog.')}
                >
                  <i className="fa-solid fa-file-invoice"></i> Request Metal Price Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Export Section */}
      <section className="export-section" id="export">
        <div className="container">
          <div className="export-banner-wrap">
            <div className="export-banner-content">
              <span className="export-eyebrow">WORLDWIDE CONSIGNMENTS</span>
              <h2 className="export-title">Global Sourcing & International Export</h2>
              <p className="export-desc">
                Verdanta World exports verified handmade Indian crafts to over 24 countries. We manage phytosanitary certifications, fumigation, compliant palletization, and door-to-port logistics for overseas buyers.
              </p>
              <div className="export-actions">
                <button
                  type="button"
                  className="btn btn-primary export-btn"
                  onClick={() => openProposalModal('Global Sourcing & Export', 'Inquiry for overseas container shipment, customs compliance, and export FOB/CIF pricing.')}
                >
                  <i className="fa-solid fa-plane-departure"></i> Initiate Export Consignment
                </button>
                <button
                  type="button"
                  className="btn btn-secondary export-btn"
                  onClick={() => handleDownloadCatalogue('Global Export')}
                >
                  <i className="fa-solid fa-file-arrow-down"></i> Download 2026 Lookbook
                </button>
                <button
                  type="button"
                  className="btn btn-outline export-btn"
                  onClick={() => setIsVisitModalOpen(true)}
                >
                  <i className="fa-solid fa-landmark"></i> Schedule Atelier Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
