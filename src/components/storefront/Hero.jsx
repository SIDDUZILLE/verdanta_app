import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function Hero() {
  const { heroData, openProposalModal } = useStore();

  const handleSecondaryClick = (e) => {
    e.preventDefault();
    const link = (heroData.secondaryBtnLink || 'modal:proposal').trim();
    if (link.startsWith('modal:') || link === 'proposal') {
      openProposalModal('General Inquiry');
    } else if (link.startsWith('#')) {
      const el = document.querySelector(link);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (link) {
      window.location.href = link;
    }
  };

  const heroBg = heroData.image || heroData.defaultImage || 'images/hero.jpg';

  return (
    <>
      <section className="hero-section" id="home">
        {/* Background with luxury gradient overlay */}
        <div
          className="hero-backdrop"
          id="heroBackdrop"
          style={{ backgroundImage: `url("${heroBg}")` }}
        >
          <div className="hero-overlay"></div>
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow" id="heroEyebrow">
              {heroData.eyebrow || 'ARTISANAL EXCELLENCE • DIRECT FROM INDIA'}
            </span>

            <h1 className="hero-title" id="heroTitle">
              {(heroData.title || 'CRAFTED BY ARTISANS.\nINSPIRED BY INDIA.\nMADE MEANINGFUL.')
                .split('\n')
                .map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < heroData.title.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
            </h1>

            <p className="hero-subtitle" id="heroSubtitle">
              {heroData.description ||
                'Discover thoughtfully crafted home décor and meaningful gifts that celebrate Indian craftsmanship, empower artisans and inspire more sustainable living.'}
            </p>

            <div className="hero-actions">
              {heroData.primaryBtnText && (
                <a
                  href={heroData.primaryBtnLink || '#categories'}
                  className="btn btn-primary hero-btn"
                  id="heroShopBtn"
                >
                  <i className="fa-solid fa-compass"></i> {heroData.primaryBtnText}
                </a>
              )}

              {heroData.secondaryBtnText && (
                <button
                  type="button"
                  className="btn btn-secondary hero-btn"
                  id="heroProposalBtn"
                  onClick={handleSecondaryClick}
                >
                  <i className="fa-solid fa-file-signature"></i> {heroData.secondaryBtnText}
                </button>
              )}
            </div>

            {/* Trust Highlights */}
            <div className="hero-trust-bar">
              <div className="trust-item">
                <i className="fa-solid fa-certificate"></i>
                <span>Authentic Master Artisans</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-earth-asia"></i>
                <span>Direct Global Shipping</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-recycle"></i>
                <span>Zero-Waste & ESG Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar / Why Us */}
      <section className="trust-bar" id="why-us">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-hand-holding-heart"></i></div>
            <div className="trust-text">
              <strong>Fair Trade Certified</strong>
              <span>Empowering indigenous craft clusters</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-seedling"></i></div>
            <div className="trust-text">
              <strong>100% Eco-Conscious</strong>
              <span>Zero plastic packaging &amp; natural materials</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-earth-americas"></i></div>
            <div className="trust-text">
              <strong>Worldwide Export</strong>
              <span>Reliable shipping to over 40 countries</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-award"></i></div>
            <div className="trust-text">
              <strong>Master Craftsmanship</strong>
              <span>Heirloom quality handcrafted pieces</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
