import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function SustainabilitySection() {
  const { openProposalModal } = useStore();

  return (
    <section className="sustainability-section" id="sustainability">
      <div className="container">
        {/* Sustainability Hero Header */}
        <div className="sustain-hero-card">
          <div className="sustain-hero-bg" style={{ backgroundImage: "url('images/sustainability-banner.jpg')" }}></div>
          <div className="sustain-hero-overlay"></div>
          <div className="sustain-hero-content">
            <div className="sustain-hero-left">
              <h2 className="sustain-main-title">Sustainability<br />&amp; Impact</h2>
              <div className="sustain-tagline">PRESERVE HERITAGE • EMPOWER ARTISANS • PROTECT THE PLANET</div>
              <p className="sustain-intro-text">
                At <strong>Verdanta World</strong>, we believe beautiful products can create meaningful impact. We bring
                together Indian craftsmanship, responsible sourcing and conscious design to create products that are good
                for people, communities and the planet.
              </p>
            </div>
            <div className="sustain-hero-right">
              <div className="sustain-script-badge">
                <span className="script-text">Crafting<br />a Better<br />Tomorrow</span>
                <i className="fa-solid fa-leaf script-leaf"></i>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Impact Pillar Cards Grid */}
        <div className="sustain-cards-grid">
          {/* Card 1: Sustainable & ESG Gifting */}
          <div className="sustain-pillar-card">
            <div className="sustain-card-img-wrap">
              <img src="images/esg-corporate.jpg" alt="Sustainable & ESG Gifting" loading="lazy" />
              <div className="pillar-round-badge badge-green">
                <i className="fa-solid fa-leaf"></i>
              </div>
            </div>
            <div className="sustain-card-body">
              <h3 className="pillar-card-title">Sustainable &amp; ESG Gifting</h3>
              <p className="pillar-card-desc">
                Thoughtfully curated corporate gifting solutions using sustainable materials and artisan-made products,
                helping businesses align with their ESG goals.
              </p>
              <button
                type="button"
                onClick={() => openProposalModal('Sustainable & ESG Gifting')}
                className="pillar-learn-more"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Learn More <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Card 2: Artisan Empowerment */}
          <div className="sustain-pillar-card">
            <div className="sustain-card-img-wrap">
              <img src="images/wooden-gallery.jpg" alt="Artisan Empowerment" loading="lazy" />
              <div className="pillar-round-badge badge-terracotta">
                <i className="fa-solid fa-users"></i>
              </div>
            </div>
            <div className="sustain-card-body">
              <h3 className="pillar-card-title">Artisan Empowerment</h3>
              <p className="pillar-card-desc">
                Supporting traditional artisans through skill development, product innovation, quality improvement and
                better access to markets.
              </p>
              <button
                type="button"
                onClick={() => openProposalModal('Artisan Empowerment & Livelihoods')}
                className="pillar-learn-more"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Learn More <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Card 3: Women Empowerment */}
          <div className="sustain-pillar-card">
            <div className="sustain-card-img-wrap">
              <img src="images/artisan-gallery.jpg" alt="Women Empowerment" loading="lazy" />
              <div className="pillar-round-badge badge-rose">
                <i className="fa-solid fa-venus"></i>
              </div>
            </div>
            <div className="sustain-card-body">
              <h3 className="pillar-card-title">Women Empowerment</h3>
              <p className="pillar-card-desc">
                Creating meaningful opportunities for women through skill development, artisan engagement and
                livelihood-focused initiatives.
              </p>
              <button
                type="button"
                onClick={() => openProposalModal('Women Empowerment Collective')}
                className="pillar-learn-more"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Learn More <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Card 4: Responsible Sourcing */}
          <div className="sustain-pillar-card">
            <div className="sustain-card-img-wrap">
              <img src="images/grass-basket.jpg" alt="Responsible Sourcing" loading="lazy" />
              <div className="pillar-round-badge badge-forest">
                <i className="fa-solid fa-seedling"></i>
              </div>
            </div>
            <div className="sustain-card-body">
              <h3 className="pillar-card-title">Responsible Sourcing</h3>
              <p className="pillar-card-desc">
                Working with responsibly sourced and natural materials such as wood, bamboo, cane, terracotta and natural
                fibres while encouraging local craftsmanship.
              </p>
              <button
                type="button"
                onClick={() => openProposalModal('Responsible & Ethical Sourcing')}
                className="pillar-learn-more"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Learn More <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Card 5: CSR & Social Impact */}
          <div className="sustain-pillar-card">
            <div className="sustain-card-img-wrap">
              <img src="images/corporate-lifestyle.jpg" alt="CSR & Social Impact" loading="lazy" />
              <div className="pillar-round-badge badge-amber">
                <i className="fa-solid fa-hand-holding-heart"></i>
              </div>
            </div>
            <div className="sustain-card-body">
              <h3 className="pillar-card-title">CSR &amp; Social Impact</h3>
              <p className="pillar-card-desc">
                Collaborating with corporates and communities on initiatives that support artisan livelihoods, preserve
                traditional crafts and create positive social impact.
              </p>
              <button
                type="button"
                onClick={() => openProposalModal('CSR & Social Impact Partnerships')}
                className="pillar-learn-more"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Learn More <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Card 6: Conscious Living */}
          <div className="sustain-pillar-card">
            <div className="sustain-card-img-wrap">
              <img src="images/premium-decor.jpg" alt="Conscious Living" loading="lazy" />
              <div className="pillar-round-badge badge-olive">
                <i className="fa-solid fa-house-chimney-window"></i>
              </div>
            </div>
            <div className="sustain-card-body">
              <h3 className="pillar-card-title">Conscious Living</h3>
              <p className="pillar-card-desc">
                Encouraging a more sustainable lifestyle through a thoughtfully curated collection of handcrafted products
                that carry a story and celebrate craftsmanship.
              </p>
              <button
                type="button"
                onClick={() => openProposalModal('Conscious Living Catalog')}
                className="pillar-learn-more"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Learn More <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* OUR COMMITMENT Bar */}
        <div className="sustain-commitment-bar">
          <div className="commitment-eyebrow">OUR COMMITMENT</div>
          <div className="commitment-items">
            <div className="commit-item">
              <i className="fa-solid fa-leaf commit-icon icon-leaf"></i>
              <span>PRESERVE HERITAGE</span>
            </div>
            <div className="commit-divider"></div>
            <div className="commit-item">
              <i className="fa-solid fa-user-group commit-icon icon-users"></i>
              <span>EMPOWER ARTISANS</span>
            </div>
            <div className="commit-divider"></div>
            <div className="commit-item">
              <i className="fa-solid fa-earth-americas commit-icon icon-globe"></i>
              <span>PROTECT THE PLANET</span>
            </div>
          </div>
        </div>

        {/* Bottom Impact Showcase Banner */}
        <div className="sustain-bottom-banner" style={{ backgroundImage: "url('images/sustainability-crafts.jpg')" }}>
          <div className="sustain-bottom-overlay"></div>
          <div className="sustain-bottom-content">
            <div className="sustain-quote-tag">
              <div className="quote-symbol">“</div>
              <p className="quote-text">
                Every product carries a story.<br />
                Every purchase can create an impact.
              </p>
              <i className="fa-solid fa-leaf quote-leaf-icon"></i>
            </div>

            <div className="sustain-partner-card">
              <h3 className="partner-card-title">Partner With Us</h3>
              <p className="partner-card-sub">
                For Sustainable Gifting • ESG Initiatives<br />
                CSR Partnerships • Artisan Development
              </p>
              <button
                type="button"
                className="btn btn-primary partner-cta-btn"
                onClick={() => openProposalModal('Sustainability & ESG Partner')}
              >
                Get in Touch <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
