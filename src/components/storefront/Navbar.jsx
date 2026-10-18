import React, { useState } from 'react';
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
    filterByChannel,
    filterByCategory,
    openCorporateGifting
  } = useStore();

  const [mobileNavActive, setMobileNavActive] = useState(false);

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
        >
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" width="34" height="34" fill="currentColor">
              <path
                d="M20 2C16.8 2 14.1 3.8 12.8 6.5C11.5 5.6 9.8 5 8 5C4.7 5 2 7.7 2 11C2 13.5 3.5 15.6 5.6 16.5C5.2 17.6 5 18.8 5 20C5 25.5 9.5 30 15 30H18V38H22V30H25C30.5 30 35 25.5 35 20C35 18.8 34.8 17.6 34.4 16.5C36.5 15.6 38 13.5 38 11C38 7.7 35.3 5 32 5C30.2 5 28.5 5.6 27.2 6.5C25.9 3.8 23.2 2 20 2Z"
                opacity="0.9"
              />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">Verdanta World</span>
            <span className="brand-tagline">ARTISAN • HERITAGE • CONSCIOUS</span>
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

            {/* Dropdown for Shop Categories */}
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
                  {/* Col 1 */}
                  <div className="mega-col">
                    <h4
                      className="mega-title"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleCategoryClick('Artisan Gallery', null, e)}
                    >
                      1. ARTISAN GALLERY
                    </h4>
                    <ul className="mega-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Artisan Gallery', 'Lamps & Ambient Lighting', e)}>
                          <i className="fa-solid fa-angle-right"></i> Lamps &amp; Ambient Lighting
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Artisan Gallery', 'Terracotta & Clay Crafts', e)}>
                          <i className="fa-solid fa-angle-right"></i> Terracotta &amp; Clay Crafts
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Artisan Gallery', 'Handwoven', e)}>
                          <i className="fa-solid fa-angle-right"></i> Handwoven
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Artisan Gallery', 'Cane crafts', e)}>
                          <i className="fa-solid fa-angle-right"></i> Cane crafts
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Artisan Gallery', 'Artisan Décor', e)}>
                          <i className="fa-solid fa-angle-right"></i> Artisan Décor
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2 */}
                  <div className="mega-col">
                    <h4
                      className="mega-title"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleCategoryClick('Wooden Crafts', null, e)}
                    >
                      2. WOODEN CRAFTS
                    </h4>
                    <ul className="mega-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wooden Crafts', 'Toys', e)}>
                          <i className="fa-solid fa-angle-right"></i> Toys
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wooden Crafts', 'Keychains & Mini Gifts', e)}>
                          <i className="fa-solid fa-angle-right"></i> Keychains &amp; Mini Gifts
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wooden Crafts', 'Tea-Light Candles', e)}>
                          <i className="fa-solid fa-angle-right"></i> Tea-Light Candles
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wooden Crafts', 'Wooden Clocks', e)}>
                          <i className="fa-solid fa-angle-right"></i> Wooden Clocks
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wooden Crafts', 'Wooden Decor', e)}>
                          <i className="fa-solid fa-angle-right"></i> Wooden Decor
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3 */}
                  <div className="mega-col">
                    <h4
                      className="mega-title"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleCategoryClick('Premium Home Décor', null, e)}
                    >
                      3. PREMIUM HOME DÉCOR
                    </h4>
                    <ul className="mega-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Premium Home Décor', 'Table Décor', e)}>
                          <i className="fa-solid fa-angle-right"></i> Table Décor
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Premium Home Décor', 'Wall Décor', e)}>
                          <i className="fa-solid fa-angle-right"></i> Wall Décor
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Premium Home Décor', 'Traditional & Heritage Décor', e)}>
                          <i className="fa-solid fa-angle-right"></i> Traditional &amp; Heritage Décor
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Premium Home Décor', 'Sculptures & Figurines', e)}>
                          <i className="fa-solid fa-angle-right"></i> Sculptures &amp; Figurines
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 4 - Return Gifting */}
                  <div className="mega-col">
                    <h4
                      className="mega-title"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleCategoryClick('Return Gifting', null, e)}
                    >
                      4. RETURN GIFTING
                    </h4>
                    <ul className="mega-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Return Gifting', 'Festive Gifts', e)}>
                          <i className="fa-solid fa-angle-right"></i> Festive Gifts
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Return Gifting', 'Birthday Gifts', e)}>
                          <i className="fa-solid fa-angle-right"></i> Birthday Gifts
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Return Gifting', 'Anniversary Gifting', e)}>
                          <i className="fa-solid fa-angle-right"></i> Anniversary Gifting
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Return Gifting', 'House Warming', e)}>
                          <i className="fa-solid fa-angle-right"></i> House Warming
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Return Gifting', 'Wedding Gifts', e)}>
                          <i className="fa-solid fa-angle-right"></i> Wedding Gifts
                        </a>
                      </li>
                    </ul>
                  </div>
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

            {/* Dropdown for Corporate Gifting */}
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
                  <li>
                    <a href="#corporate" onClick={(e) => handleCorporateClick('Employee Welcome & Onboarding', e)}>
                      1. EMPLOYEE WELCOME &amp; ONBOARDING
                    </a>
                  </li>
                  <li>
                    <a href="#corporate" onClick={(e) => handleCorporateClick('Employee Recognition & Milestones', e)}>
                      2. EMPLOYEE RECOGNITION &amp; MILESTONES
                    </a>
                  </li>
                  <li>
                    <a href="#corporate" onClick={(e) => handleCorporateClick('Festive & Celebration Gifting', e)}>
                      3. FESTIVE &amp; CELEBRATION GIFTING
                    </a>
                  </li>
                  <li>
                    <a href="#corporate" onClick={(e) => handleCorporateClick('Client, Partner & Executive Gifting', e)}>
                      4. CLIENT, PARTNER &amp; EXECUTIVE GIFTING
                    </a>
                  </li>
                  <li>
                    <a href="#corporate" onClick={(e) => handleCorporateClick('Sustainable & ESG Gifting', e)}>
                      5. SUSTAINABLE &amp; ESG GIFTING
                    </a>
                  </li>
                  <li>
                    <a href="#corporate" onClick={(e) => handleCorporateClick('Curated & Custom Corporate Gift Sets', e)}>
                      6. CURATED &amp; CUSTOM CORPORATE GIFT SETS
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            {/* Dropdown for Wholesale */}
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
                  <div className="split-menu-col">
                    <h4 className="split-menu-header">
                      <a href="#categories" className="split-header-link" onClick={(e) => handleCategoryClick('Wholesale Wood Crafts', null, e)}>
                        WOOD
                      </a>
                    </h4>
                    <ul className="split-menu-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Wood Crafts', 'Elephant', e)}>
                          1. Elephant
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Wood Crafts', 'Buddha', e)}>
                          2. Buddha
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Wood Crafts', 'Tea-Light Holders', e)}>
                          3. Tea-Light Holders
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Wood Crafts', 'Traditional Toys & Figurines', e)}>
                          4. Traditional Toys &amp; Figurines
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Wood Crafts', 'Decorative Boxes & Trays', e)}>
                          5. Decorative Boxes &amp; Trays
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="split-menu-col">
                    <h4 className="split-menu-header">
                      <a href="#categories" className="split-header-link" onClick={(e) => handleCategoryClick('Wholesale Metal Crafts', null, e)}>
                        METAL
                      </a>
                    </h4>
                    <ul className="split-menu-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Metal Crafts', 'Radha Krishna', e)}>
                          1. Radha Krishna
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Metal Crafts', 'Buddha', e)}>
                          2. Buddha
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Metal Crafts', 'Musician Sets', e)}>
                          3. Musician Sets
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Metal Crafts', 'Elephant & Animal', e)}>
                          4. Elephant &amp; Animal
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Wholesale Metal Crafts', 'Artistic Wall Décor', e)}>
                          5. Artistic Wall Décor
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            {/* Dropdown for Export */}
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
                  <div className="split-menu-col">
                    <h4 className="split-menu-header">
                      <a href="#categories" className="split-header-link" onClick={(e) => handleCategoryClick('Export Wood Crafts', null, e)}>
                        WOOD
                      </a>
                    </h4>
                    <ul className="split-menu-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Wood Crafts', 'Wooden Decorative Trays', e)}>
                          1. Wooden Decorative Trays
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Wood Crafts', 'Wooden Boxes & Organisers', e)}>
                          2. Wooden Boxes &amp; Organisers
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Wood Crafts', 'Wooden Tea-Light Holders', e)}>
                          3. Wooden Tea-Light Holders
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Wood Crafts', 'Figurines & Sculptural Décor', e)}>
                          4. Figurines &amp; Sculptural Décor
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Wood Crafts', 'Traditional Toys & Play Objects', e)}>
                          5. Traditional Toys &amp; Play Objects
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="split-menu-col">
                    <h4 className="split-menu-header">
                      <a href="#categories" className="split-header-link" onClick={(e) => handleCategoryClick('Export Metal Crafts', null, e)}>
                        METAL
                      </a>
                    </h4>
                    <ul className="split-menu-list">
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Metal Crafts', 'Metal Sculptural Figurines', e)}>
                          1. Metal Sculptural Figurines
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Metal Crafts', 'Metal Table & Wall Décor', e)}>
                          2. Metal Table &amp; Wall Décor
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Metal Crafts', 'Candle / Tea-Light Holders', e)}>
                          3. Candle / Tea-Light Holders
                        </a>
                      </li>
                      <li>
                        <a href="#categories" onClick={(e) => handleCategoryClick('Export Metal Crafts', 'Indian Musician Sets', e)}>
                          4. Indian Musician Sets
                        </a>
                      </li>
                    </ul>
                  </div>
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
                onClick={(e) => handleVisitClick(e)}
              >
                ATELIER VISIT
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
