import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function Navbar() {
  const {
    categories = [],
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOverlayOpen,
    setIsVisitModalOpen,
    whatsappNumber,
    filterByChannel,
    filterByCategory,
    openCorporateGifting
  } = useStore();

  const [mobileNavActive, setMobileNavActive] = useState(false);

  // Filter categories by channel for dynamic navigation
  const shopCategories = categories.filter(c => c.channel === 'shop' || (!c.channel && !c.id.includes('wholesale') && !c.id.includes('export') && c.id !== 'corporate-gifting'));
  const corpCategory = categories.find(c => c.id === 'corporate-gifting' || c.channel === 'corporate');
  const corpSubCategories = corpCategory?.subCategories && corpCategory.subCategories.length > 0
    ? corpCategory.subCategories
    : [
      'Employee Welcome & Onboarding',
      'Employee Recognition & Milestones',
      'Festive & Celebration Gifting',
      'Client, Partner & Executive Gifting',
      'Sustainable & ESG Gifting',
      'Curated & Custom Corporate Gift Sets'
    ];

  const wholesaleCategories = categories.filter(c => c.channel === 'wholesale' || c.id.startsWith('wholesale'));
  const exportCategories = categories.filter(c => c.channel === 'export' || c.id.startsWith('export'));

  // Smooth scroll helper
  const handleNavScroll = (targetId, e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileNavActive(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category and sub-category click helper
  const handleCategoryClick = (categoryName, subCategory = null, e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileNavActive(false);
    filterByCategory(categoryName, subCategory);
  };

  // Corporate gifting click helper
  const handleCorporateClick = (subCategory = 'all', e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileNavActive(false);
    openCorporateGifting(subCategory);
  };

  // Channel filter helper
  const handleChannelClick = (channel, e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileNavActive(false);
    filterByChannel(channel);
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Atelier visit helper
  const handleVisitClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileNavActive(false);
    setIsVisitModalOpen(true);
    const el = document.getElementById('visit-us');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="site-header" id="siteHeader">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span><i className="fa-solid fa-leaf"></i> 100% ETHICALLY SOURCED &bull; EMPOWERING 1,200+ TRADITIONAL ARTISANS</span>
          <span className="announcement-desktop-only">COMPLIMENTARY SHIPPING ON DOMESTIC ORDERS OVER ₹2,499</span>
          <div className="currency-selector">
            <span>INR (₹)</span> | <span>USD ($)</span>
          </div>
        </div>
      </div>

      {/* Main Header Inner */}
      <div className="container header-inner">
        {/* Mobile Menu Button */}
        <button
          className="mobile-toggle-btn"
          id="mobileMenuBtn"
          aria-label="Toggle navigation"
          onClick={() => setMobileNavActive(prev => !prev)}
        >
          <i className={`fa-solid ${mobileNavActive ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Brand Logo */}
        <a
          href="#home"
          className="brand-logo"
          id="brandLogo"
          onClick={(e) => handleNavScroll('home', e)}
          title="Verdanta World — Crafted by Nature, Inspired by Art"
        >
          <div className="brand-icon">
            <img
              src="/images/logo-icon.png"
              alt="Verdanta World Emblem"
              className="brand-emblem-img"
              width="44"
              height="44"
            />
          </div>
          <div className="brand-text">
            <span className="brand-name">Verdanta World</span>
            <span className="brand-tagline">CRAFTED BY NATURE, INSPIRED BY ART.</span>
          </div>
        </a>

        {/* Right Action Icons */}
        <div className="header-actions">
          <button
            type="button"
            className="action-icon-btn"
            id="searchTriggerBtn"
            title="Search catalog"
            onClick={() => setIsSearchOverlayOpen(true)}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          <button
            type="button"
            className="action-icon-btn"
            id="wishlistTriggerBtn"
            title="Saved Wishlist"
            onClick={() => {
              const el = document.getElementById('categories');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <i className="fa-regular fa-heart"></i>
            {wishlist.length > 0 && <span className="action-badge" id="wishlistCount">{wishlist.length}</span>}
          </button>

          <button
            type="button"
            className="action-icon-btn cart-icon-btn"
            id="cartTriggerBtn"
            title="Shopping Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <i className="fa-solid fa-bag-shopping"></i>
            {cartItemCount > 0 && <span className="action-badge" id="cartCount">{cartItemCount}</span>}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`main-navigation ${mobileNavActive ? 'mobile-active' : ''}`} id="mainNavigation">
        <div className="container">
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                className="nav-link"
                onClick={(e) => handleNavScroll('home', e)}
              >
                HOME
              </a>
            </li>

            {/* Dropdown for Shop Categories (Dynamic Real-Time Synced) */}
            <li className="has-dropdown shop-dropdown-item">
              <a
                href="#categories"
                className="nav-link"
                onClick={(e) => handleCategoryClick('all', null, e)}
              >
                SHOP COLLECTIONS <i className="fa-solid fa-chevron-down nav-caret"></i>
              </a>
              <div className="mega-dropdown">
                <div className="mega-dropdown-grid" id="shopMegaDropdownGrid">
                  {shopCategories.map((cat, idx) => (
                    <div className="mega-col" key={cat.id}>
                      <h4
                        className="mega-title"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => handleCategoryClick(cat.name, null, e)}
                      >
                        {cat.displayName || `${idx + 1}. ${cat.name.toUpperCase()}`}
                      </h4>
                      <ul className="mega-list">
                        {(cat.subCategories || []).map((sub, sIdx) => (
                          <li key={sIdx}>
                            <a
                              href="#categories"
                              onClick={(e) => handleCategoryClick(cat.name, sub, e)}
                            >
                              <i className="fa-solid fa-angle-right"></i> {sub}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Mega Dropdown Footer */}
                <div className="mega-dropdown-footer">
                  <span>
                    <i className="fa-solid fa-hand-holding-heart" style={{ color: 'var(--color-gold)', marginRight: '8px' }}></i>
                    Crafted by Master Artisans &bull; 100% Ethical &amp; Sustainable
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={(e) => handleCategoryClick('all', null, e)}
                  >
                    View All Collections
                  </button>
                </div>
              </div>
            </li>

            {/* Dropdown for Corporate Gifting (Dynamic Real-Time Synced) */}
            <li className="has-dropdown corporate-dropdown-item">
              <a
                href="#corporate"
                className="nav-link"
                onClick={(e) => handleCorporateClick('all', e)}
              >
                CORPORATE GIFTING <i className="fa-solid fa-chevron-down nav-caret"></i>
              </a>
              <div className="corporate-menu-dropdown">
                <ul className="corporate-menu-list">
                  {corpSubCategories.map((sub, idx) => (
                    <li key={idx}>
                      <a href="#corporate" onClick={(e) => handleCorporateClick(sub, e)}>
                        {idx + 1}. {sub.toUpperCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Dropdown for Wholesale (Dynamic Real-Time Synced) */}
            <li className="has-dropdown wholesale-dropdown-item">
              <a
                href="#categories"
                className="nav-link"
                onClick={(e) => handleChannelClick('wholesale', e)}
              >
                WHOLESALE <i className="fa-solid fa-chevron-down nav-caret"></i>
              </a>
              <div className="split-menu-dropdown wholesale-menu-dropdown">
                <div className="split-menu-grid" id="wholesaleDropdownGrid">
                  {wholesaleCategories.map(cat => (
                    <div className="split-menu-col" key={cat.id}>
                      <h4 className="split-menu-header">
                        <a
                          href="#categories"
                          className="split-header-link"
                          onClick={(e) => handleCategoryClick(cat.name, null, e)}
                        >
                          {cat.name.replace(/wholesale\s*/i, '').toUpperCase()}
                        </a>
                      </h4>
                      <ul className="split-menu-list">
                        {(cat.subCategories || []).map((sub, sIdx) => (
                          <li key={sIdx}>
                            <a
                              href="#categories"
                              onClick={(e) => handleCategoryClick(cat.name, sub, e)}
                            >
                              {sIdx + 1}. {sub}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            {/* Dropdown for Export (Dynamic Real-Time Synced) */}
            <li className="has-dropdown export-dropdown-item">
              <a
                href="#categories"
                className="nav-link"
                onClick={(e) => handleChannelClick('export', e)}
              >
                EXPORT <i className="fa-solid fa-chevron-down nav-caret"></i>
              </a>
              <div className="split-menu-dropdown export-menu-dropdown">
                <div className="split-menu-grid" id="exportDropdownGrid">
                  {exportCategories.map(cat => (
                    <div className="split-menu-col" key={cat.id}>
                      <h4 className="split-menu-header">
                        <a
                          href="#categories"
                          className="split-header-link"
                          onClick={(e) => handleCategoryClick(cat.name, null, e)}
                        >
                          {cat.name.replace(/export\s*/i, '').toUpperCase()}
                        </a>
                      </h4>
                      <ul className="split-menu-list">
                        {(cat.subCategories || []).map((sub, sIdx) => (
                          <li key={sIdx}>
                            <a
                              href="#categories"
                              onClick={(e) => handleCategoryClick(cat.name, sub, e)}
                            >
                              {sIdx + 1}. {sub}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            <li>
              <a
                href="#why-us"
                className="nav-link"
                onClick={(e) => handleNavScroll('why-us', e)}
              >
                WHY US
              </a>
            </li>

            <li>
              <a
                href="#sustainability"
                className="nav-link"
                onClick={(e) => handleNavScroll('sustainability', e)}
              >
                SUSTAINABILITY
              </a>
            </li>

            <li>
              <a
                href="#visit-us"
                className="nav-link"
                onClick={(e) => handleNavScroll('visit-us', e)}
              >
                VISIT SHOWROOM
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="nav-link"
                onClick={(e) => handleNavScroll('contact', e)}
              >
                CONTACT
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
