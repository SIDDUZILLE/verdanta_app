import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Footer() {
  const { whatsappNumber, filterByChannel, setIsVisitModalOpen, openProposalModal } = useStore();

  const handleScrollTo = (channel, id) => {
    filterByChannel(channel);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Col 1: Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="brand-monogram">V</span>
            <div>
              <span className="brand-name">VERDANTA</span>
              <span className="brand-tagline">WORLD • HEIRLOOMS OF INDIA</span>
            </div>
          </div>
          <p className="footer-about">
            Verdanta World bridges India's rich artisanal heritage with contemporary living. Each creation is thoughtfully handcrafted by master artisans, preserving generational craft legacies and fostering sustainable artisan livelihoods.
          </p>
          <div className="footer-social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <i className="fa-brands fa-pinterest"></i>
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Verdanta Concierge, I would like to inquire about your collections.')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Col 2: Retail Collections */}
        <div className="footer-col">
          <h4 className="footer-heading">Collections</h4>
          <ul className="footer-links">
            <li>
              <button type="button" onClick={() => handleScrollTo('shop', 'categories')}>
                Artisan Gallery (Pottery & Terracotta)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleScrollTo('shop', 'categories')}>
                Carved Wooden Clocks & Toys
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleScrollTo('shop', 'categories')}>
                Premium Brass Urlis & Statues
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleScrollTo('shop', 'categories')}>
                Handcrafted Gifting Keepsakes
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleScrollTo('corporate', 'corporate')}>
                Corporate ESG Hampers
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Enterprise & Export */}
        <div className="footer-col">
          <h4 className="footer-heading">Enterprise & Wholesale</h4>
          <ul className="footer-links">
            <li>
              <button type="button" onClick={() => handleScrollTo('corporate', 'corporate')}>
                Corporate Employee Gifting
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleScrollTo('wholesale', 'wholesale')}>
                Wholesale Wood & Brass B2B
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleScrollTo('export', 'export')}>
                Global Export Sourcing (FOB/CIF)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openProposalModal('Bespoke Enterprise Project')}>
                Custom Laser Monogramming
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setIsVisitModalOpen(true)}>
                Book Atelier Studio Tour
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Atelier Concierge */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Artisan Concierge</h4>
          <div className="contact-item">
            <i className="fa-brands fa-whatsapp contact-icon"></i>
            <div>
              <strong>WhatsApp Direct:</strong>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                +91 88676 88699
              </a>
            </div>
          </div>
          <div className="contact-item">
            <i className="fa-regular fa-envelope contact-icon"></i>
            <div>
              <strong>Direct Inquiries:</strong>
              <a href="mailto:concierge@verdantaworld.com">concierge@verdantaworld.com</a>
            </div>
          </div>
          <div className="contact-item">
            <i className="fa-solid fa-location-dot contact-icon"></i>
            <div>
              <strong>Experience Studios:</strong>
              <span>Jaipur Atelier • Bangalore Experience Centre</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Verdanta World. All handcrafted designs and artisanal heirlooms protected.
          </p>

          <div className="footer-bottom-actions">
            <span>Direct from 150+ Rural Indian Craft Clusters</span>
            <Link to="/admin" className="admin-footer-link" title="Open Admin CMS">
              <i className="fa-solid fa-lock"></i> Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
