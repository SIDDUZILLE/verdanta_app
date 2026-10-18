import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Footer() {
  const { whatsappNumber, filterByCategory, openCorporateGifting, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleNavScroll = (targetId, e) => {
    if (e && e.preventDefault) e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast('Thank you for subscribing to Artisan Chronicles!');
    setEmailInput('');
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-inner">
        {/* Footer Brand Column */}
        <div className="footer-col footer-col-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 40 40" width="30" height="30" fill="#c49d63">
              <path
                d="M20 2C16.8 2 14.1 3.8 12.8 6.5C11.5 5.6 9.8 5 8 5C4.7 5 2 7.7 2 11C2 13.5 3.5 15.6 5.6 16.5C5.2 17.6 5 18.8 5 20C5 25.5 9.5 30 15 30H18V38H22V30H25C30.5 30 35 25.5 35 20C35 18.8 34.8 17.6 34.4 16.5C36.5 15.6 38 13.5 38 11C38 7.7 35.3 5 32 5C30.2 5 28.5 5.6 27.2 6.5C25.9 3.8 23.2 2 20 2Z"
              />
            </svg>
            <span className="footer-brand-name">Verdanta World</span>
          </div>
          <p className="footer-brand-mission">
            Preserving and celebrating premium, authentic, and globally-credible Indian craftsmanship. Handcrafted by generational master artisans.
          </p>
          <p className="footer-contact-info">
            <i className="fa-solid fa-envelope"></i>{' '}
            <a href="mailto:contact@verdantaworld.com" style={{ color: 'inherit', textDecoration: 'none' }}>
              contact@verdantaworld.com
            </a>
            <br />
            <i className="fa-solid fa-phone"></i>{' '}
            <a href="tel:+918867688699" style={{ color: 'inherit', textDecoration: 'none' }}>
              +91 88676 88699
            </a>
            <br />
            <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>{' '}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              WhatsApp: +91 88676 88699
            </a>
            <br />
            <i className="fa-solid fa-location-dot"></i>{' '}
            <a
              href="https://maps.app.goo.gl/5ZTcvKAGmps1qPbG7?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Jaipur Atelier &bull; Bengaluru Experience Centre (Map)
            </a>
          </p>
          <p className="footer-copyright">
            Copyright &copy; {new Date().getFullYear()} | Verdanta World. All Rights Reserved.
          </p>
        </div>

        {/* Footer Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">NAVIGATION</h4>
          <ul className="footer-menu">
            <li><a href="#home" onClick={(e) => handleNavScroll('home', e)}>Home</a></li>
            <li><a href="#categories" onClick={(e) => { filterByCategory('all'); handleNavScroll('categories', e); }}>Shop Collections</a></li>
            <li><a href="#corporate" onClick={(e) => handleNavScroll('corporate', e)}>Corporate Gifting</a></li>
            <li><a href="#wholesale" onClick={(e) => handleNavScroll('wholesale', e)}>Wholesale Partners</a></li>
            <li><a href="#export" onClick={(e) => handleNavScroll('export', e)}>Export &amp; Sourcing</a></li>
            <li><a href="#why-us" onClick={(e) => handleNavScroll('why-us', e)}>Why Us</a></li>
            <li><a href="#sustainability" onClick={(e) => handleNavScroll('sustainability', e)}>Sustainability</a></li>
            <li><a href="#visit-us" onClick={(e) => handleNavScroll('visit-us', e)}>Visit Us</a></li>
            <li><a href="#contact" onClick={(e) => handleNavScroll('contact', e)}>Contact</a></li>
          </ul>
        </div>

        {/* Footer Collections List */}
        <div className="footer-col">
          <h4 className="footer-col-title">COLLECTIONS</h4>
          <ul className="footer-menu">
            <li>
              <a href="#categories" onClick={(e) => { filterByCategory('Artisan Gallery'); handleNavScroll('categories', e); }}>
                Artisan Gallery
              </a>
            </li>
            <li>
              <a href="#categories" onClick={(e) => { filterByCategory('Wooden Gallery'); handleNavScroll('categories', e); }}>
                Wooden Gallery
              </a>
            </li>
            <li>
              <a href="#categories" onClick={(e) => { filterByCategory('Premium Home Decor'); handleNavScroll('categories', e); }}>
                Premium Home Décor
              </a>
            </li>
            <li>
              <a href="#corporate" onClick={(e) => { openCorporateGifting('Sustainable & ESG Gifting'); handleNavScroll('corporate', e); }}>
                ESG Corporate Solutions
              </a>
            </li>
            <li>
              <a href="#categories" onClick={(e) => { filterByCategory('Personalization Gifting'); handleNavScroll('categories', e); }}>
                Personalization Gifting
              </a>
            </li>
          </ul>
        </div>

        {/* Social and Newsletter */}
        <div className="footer-col footer-col-social">
          <h4 className="footer-col-title">CONNECT WITH US</h4>
          <div className="social-links">
            <a
              href="https://www.instagram.com/verdantaworld?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-btn"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="social-btn"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-btn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="social-btn">
              <i className="fa-brands fa-pinterest-p"></i>
            </a>
          </div>

          <div className="footer-newsletter">
            <span className="newsletter-title">Subscribe to Artisan Chronicles</span>
            <p className="newsletter-sub">Receive seasonal collection previews and craft heritage stories.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your business or personal email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link
              to="/admin"
              className="admin-portal-btn"
              style={{
                display: 'inline-flex',
                color: 'var(--color-gold-light)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'rgba(197, 157, 95, 0.3)'
              }}
              title="Open Staff Admin Management Portal"
            >
              <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i> Staff Management Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
