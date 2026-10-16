import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function CorporateSection() {
  const { corporateCards, openProposalModal } = useStore();

  const handleEnquiry = (card) => {
    const notes = `Corporate Gifting Inquiry: ${card.title}\nCategory: ${card.categoryKey || card.title}\nPlease share customization options, minimum order quantities, and enterprise pricing.`;
    openProposalModal(card.title, notes);
  };

  return (
    <section className="corporate-section" id="corporate">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="section-eyebrow">ENTERPRISE & B2B SOLUTIONS</span>
          <h2 className="section-title">Corporate & ESG Gifting</h2>
          <p className="section-desc">
            Make a lasting impression with thoughtfully curated, artisan-crafted gifts that empower Indian craft communities and reflect your organization's commitment to sustainability.
          </p>
        </div>

        {/* 6 Corporate Reference Cards Grid */}
        <div className="corporate-reference-grid" id="corporateCardsGrid">
          {corporateCards.map(card => {
            const imgSrc = card.image || card.defaultImage || 'images/corporate-lifestyle.jpg';
            return (
              <div key={card.id} className="corp-card-ref" id={`card-${card.id}`}>
                <div className="corp-card-img-wrap">
                  <img
                    src={imgSrc}
                    alt={card.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'images/corporate-lifestyle.jpg';
                    }}
                  />
                </div>
                <div className="corp-card-body-ref">
                  <div className="corp-card-head-row">
                    <div className="corp-card-icon-pill">
                      <i className={card.icon || 'fa-solid fa-leaf'}></i>
                    </div>
                    <h3 className="corp-card-title-ref">{card.title}</h3>
                  </div>
                  <p className="corp-card-desc-ref">{card.description}</p>
                  <button
                    type="button"
                    className="corp-card-btn-ref"
                    onClick={() => handleEnquiry(card)}
                  >
                    <i className="fa-solid fa-paper-plane"></i> Enquire Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
