import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function WholesaleSection() {
  const { openProposalModal, openCatalogueModal } = useStore();

  return (
    <section className="b2b-section" id="wholesale">
      <div className="container">
        <div className="b2b-grid">
          {/* Wholesale Column: Indian Retail Partners */}
          <div className="b2b-card" id="retail-partners">
            <div className="b2b-card-image-box">
              <img
                src="images/wholesale.jpg"
                alt="Wholesale Indian Retail Partners Artisan Distribution Warehouse"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/wholesale.jpg';
                }}
              />
              <div className="b2b-badge">WHOLESALE</div>
            </div>
            <div className="b2b-card-body">
              <span className="b2b-label">DOMESTIC BULK PROCUREMENT</span>
              <h3 className="b2b-title">Indian Retail Partners</h3>
              <p className="b2b-text">
                Direct access for boutique lifestyle stores, department outlets, and interior designers across India.
                Enjoy volume pricing, guaranteed craft authenticity, and consistent domestic supply chains.
              </p>
              <ul className="b2b-features">
                <li>
                  <i className="fa-solid fa-check"></i> Low minimum order quantity (MOQ)
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Tiered wholesale margin structure
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Direct cluster dispatch across all Indian states
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-primary b2b-btn"
                onClick={() =>
                  openProposalModal(
                    'Wholesale Indian Retail',
                    'Inquiry for domestic wholesale retail partnership, cluster sourcing, and volume pricing.'
                  )
                }
              >
                REQUEST A PROPOSAL
              </button>
            </div>
          </div>

          {/* Export Column: International Buyers */}
          <div className="b2b-card" id="export">
            <div className="b2b-card-image-box">
              <img
                src="images/global-sourcing.jpg"
                alt="Export Logistics & International Cargo Fulfillment"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/global-sourcing.jpg';
                }}
              />
              <div className="b2b-badge">EXPORT</div>
            </div>
            <div className="b2b-card-body">
              <span className="b2b-label">INTERNATIONAL EXPORT SUPPLY</span>
              <h3 className="b2b-title">International Buyers &amp; Export</h3>
              <p className="b2b-text">
                Fulfilling international export consignments and shipping certified eco-conscious artisan products to
                retail partners, museum stores, and luxury distributors in North America, Europe, UAE, and APAC.
              </p>
              <ul className="b2b-features">
                <li>
                  <i className="fa-solid fa-check"></i> Export compliant phytosanitary &amp; safety standards
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Multi-currency invoicing (USD, EUR, GBP, AUD)
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Robust drop-tested export protective carton packaging
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-primary b2b-btn"
                onClick={openCatalogueModal}
              >
                DOWNLOAD CATALOGUE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
