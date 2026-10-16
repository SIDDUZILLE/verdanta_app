import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Navbar() {
  const {
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOverlayOpen,
    setIsVisitModalOpen,
    whatsappNumber,
    filterByChannel
  } = useStore();

  const handleNavClick = (channel, targetId) => {
    filterByChannel(channel);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      {/* Top Announcement Bar */}
      <div
        className="top-announcement-bar"
        style={{
          backgroundColor: 'var(--color-primary-dark)',
          color: '#ffffff',
          fontSize: '0.75rem',
          padding: '8px 20px',
          letterSpacing: '0.5px'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <i className="fa-solid fa-leaf" style={{ color: 'var(--color-gold)', marginRight: '6px' }}></i>
            100% Authentic Indian Artisan Craftsmanship &bull; Direct Atelier Dispatch
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>
              <i className="fa-solid fa-truck-fast" style={{ color: 'var(--color-gold)', marginRight: '6px' }}></i>
              Complimentary Shipping Above ₹2,499
            </span>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Verdanta Concierge, I would like to inquire about your collections.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-gold-light)', textDecoration: 'none' }}
            >
              <i className="fa-brands fa-whatsapp"></i> +91 88676 88699
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Inner */}
      <div className="header-inner container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-name">VERDANTA</span>
          <span className="brand-tagline">WORLD &bull; HEIRLOOMS OF INDIA</span>
        </Link>

        {/* Header Action Icons */}
        <div className="header-actions">
          {/* Search Trigger */}
          <button
            type="button"
            className="action-icon-btn"
            onClick={() => setIsSearchOverlayOpen(true)}
            title="Search Creations"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* Wishlist Indicator */}
          <button
            type="button"
            className="action-icon-btn"
            title="Saved Heirlooms"
            aria-label="Wishlist"
            onClick={() => {
              const el = document.getElementById('categories');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <i className="fa-regular fa-heart"></i>
            {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            className="action-icon-btn"
            onClick={() => setIsCartOpen(true)}
            title="View Shopping Bag"
            aria-label="Shopping Bag"
          >
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="action-badge">{cartItemCount}</span>
          </button>

          {/* Admin Portal Gateway */}
          <Link
            to="/admin"
            className="admin-portal-btn"
            title="Open Admin Management Portal"
          >
            <i className="fa-solid fa-shield-halved"></i>
            <span className="admin-pill">Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-navigation">
        <div className="container">
          <ul className="nav-links">
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => handleNavClick('shop', 'collections')}
              >
                SHOP COLLECTIONS
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => handleNavClick('corporate', 'corporate')}
              >
                CORPORATE GIFTING
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => handleNavClick('wholesale', 'wholesale')}
              >
                WHOLESALE
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => handleNavClick('export', 'export')}
              >
                EXPORT
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => setIsVisitModalOpen(true)}
              >
                ATELIER VISIT
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
