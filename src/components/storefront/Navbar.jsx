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

  const handleNavClick = (channel, hash) => {
    filterByChannel(channel);
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-header">
      {/* Top Luxury Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <div className="announcement-item">
            <i className="fa-solid fa-leaf"></i> 100% Authentic Indian Artisan Craftsmanship
          </div>
          <div className="announcement-item hide-mobile">
            <i className="fa-solid fa-truck-fast"></i> Complimentary Delivery on Curations Above ₹2,499
          </div>
          <div className="announcement-item">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Verdanta Concierge, I would like to inquire about your handcrafted collections.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-concierge-link"
            >
              <i className="fa-brands fa-whatsapp"></i> Artisan Concierge: +91 88676 88699
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-navbar">
        <div className="container nav-container">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-monogram">V</span>
            <div className="brand-text-wrap">
              <span className="brand-name">VERDANTA</span>
              <span className="brand-tagline">WORLD • HEIRLOOMS OF INDIA</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick('shop', '#categories')}
            >
              Shop Collections
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick('corporate', '#corporate')}
            >
              Corporate Gifting
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick('wholesale', '#wholesale')}
            >
              Wholesale
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick('export', '#export')}
            >
              Export
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => setIsVisitModalOpen(true)}
            >
              Book Studio Visit
            </button>
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            {/* Search Trigger */}
            <button
              type="button"
              className="nav-action-icon"
              onClick={() => setIsSearchOverlayOpen(true)}
              title="Search Creations"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            {/* Wishlist Indicator */}
            <button
              type="button"
              className="nav-action-icon hide-mobile"
              title="Saved Heirlooms"
              aria-label="Wishlist"
              onClick={() => {
                const el = document.getElementById('categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <i className="fa-regular fa-heart"></i>
              {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              className="nav-action-icon bag-btn"
              onClick={() => setIsCartOpen(true)}
              title="View Shopping Bag"
              aria-label="Shopping Bag"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span className="nav-badge" id="cartCount">{cartItemCount}</span>
            </button>

            {/* Admin Portal Gateway */}
            <Link
              to="/admin"
              className="admin-gateway-btn"
              title="Open Admin Management Portal"
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span className="hide-mobile">Admin</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
