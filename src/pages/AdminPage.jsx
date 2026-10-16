import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import DashboardOverview from '../components/admin/DashboardOverview';
import ProductList from '../components/admin/ProductList';
import ProductModal from '../components/admin/ProductModal';
import CategoryManager from '../components/admin/CategoryManager';
import CategoryModal from '../components/admin/CategoryModal';
import CorporateCardsManager from '../components/admin/CorporateCardsManager';
import HeroManager from '../components/admin/HeroManager';
import ProposalsManager from '../components/admin/ProposalsManager';
import OrdersManager from '../components/admin/OrdersManager';
import SettingsManager from '../components/admin/SettingsManager';

const TAB_TITLES = {
  'dashboard': 'Dashboard Overview',
  'products': 'Category & Channel Product Management',
  'categories': 'Categories & Subcategories Management',
  'corporate-cards': 'Corporate Gifting Category Cards (3×2 Grid)',
  'hero': 'Homepage Hero Banner & Content',
  'proposals': 'Proposal Requests & B2B Inquiries',
  'orders': 'Customer Orders & Fulfillment',
  'settings': 'Store & Platform Settings'
};

export default function AdminPage() {
  const { isAuthenticated, logout, products, categories, corporateCards, proposals, orders, adminToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [initialCategory, setInitialCategory] = useState(null);
  const [initialSubCategory, setInitialSubCategory] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleOpenAddProduct = (catName = null, subCatName = null) => {
    setEditingProduct(null);
    setInitialCategory(catName);
    setInitialSubCategory(subCatName);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setInitialCategory(null);
    setInitialSubCategory(null);
    setIsProductModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="admin-layout" id="adminApp">
      {/* Toast Notification */}
      {adminToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--color-primary-dark)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            borderLeft: '4px solid var(--color-gold)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ color: 'var(--color-gold)' }}></i>
          {adminToast}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} id="adminSidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrap">
            <svg viewBox="0 0 40 40" width="30" height="30" fill="#c59d5f">
              <path d="M20 2C16.8 2 14.1 3.8 12.8 6.5C11.5 5.6 9.8 5 8 5C4.7 5 2 7.7 2 11C2 13.5 3.5 15.6 5.6 16.5C5.2 17.6 5 18.8 5 20C5 25.5 9.5 30 15 30H18V38H22V30H25C30.5 30 35 25.5 35 20C35 18.8 34.8 17.6 34.4 16.5C36.5 15.6 38 13.5 38 11C38 7.7 35.3 5 32 5C30.2 5 28.5 5.6 27.2 6.5C25.9 3.8 23.2 2 20 2Z" />
            </svg>
          </div>
          <div className="brand-meta">
            <span className="brand-title">Verdanta World</span>
            <span className="brand-sub">ADMIN CONSOLE</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-chart-pie"></i> Dashboard
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-boxes-stacked"></i> Products Catalog
                <span className="sidebar-badge" id="sidebarProductCount">{products.length}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-folder-tree"></i> Categories &amp; Subs
                <span className="sidebar-badge" id="sidebarCategoryCount">{categories.length}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'corporate-cards' ? 'active' : ''}`}
                onClick={() => { setActiveTab('corporate-cards'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-briefcase"></i> Corporate Cards
                <span className="sidebar-badge badge-gold" id="sidebarCorpCardsCount">{corporateCards.length || 6} Cards</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
                onClick={() => { setActiveTab('hero'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i> Hero Banner
                <span className="sidebar-badge" style={{ background: '#e8efe9', color: '#173b2c', fontWeight: 700 }}>Live</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
                onClick={() => { setActiveTab('proposals'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-file-signature"></i> Proposal Requests
                <span className="sidebar-badge badge-gold" id="sidebarProposalCount">{proposals.length}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-bag-shopping"></i> Customer Orders
                <span className="sidebar-badge" id="sidebarOrderCount">{orders.length}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              >
                <i className="fa-solid fa-gear"></i> Settings &amp; Storage
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="view-store-btn" target="_blank">
            <i className="fa-solid fa-arrow-up-right-from-square"></i> View Live Store
          </Link>
        </div>
      </aside>

      {/* Mobile Backdrop for Sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 49
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <h2 id="currentPageTitle">{TAB_TITLES[activeTab] || 'Dashboard Overview'}</h2>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              id="storageSettingsBtn"
              onClick={() => setIsStorageModalOpen(true)}
              style={{ background: '#fff', display: 'inline-flex', alignItems: 'center', gap: '7px', border: '1px solid #c59d5f', color: 'var(--color-primary)', fontWeight: 600, padding: '7px 14px', borderRadius: '4px' }}
            >
              <i className="fa-solid fa-hard-drive" style={{ color: 'var(--color-gold)' }}></i>
              <span id="storageStatusText">Storage: Hostinger Server</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleOpenAddProduct()}
              style={{ background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff', fontWeight: 700, boxShadow: '0 2px 8px rgba(197, 157, 95, 0.3)' }}
            >
              <i className="fa-solid fa-camera"></i> + Add Product Photo
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('products')}
              style={{ background: '#fff' }}
            >
              <i className="fa-solid fa-boxes-stacked"></i> Category Products
            </button>

            <div className="admin-avatar">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Artisan Admin</span>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={logout}
              style={{ background: '#fff', borderColor: '#d32f2f', color: '#d32f2f', fontWeight: 600, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Sign out of Admin Console"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <DashboardOverview onSwitchTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'products' && (
            <ProductList
              onOpenAdd={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
              onOpenAddCategory={handleOpenAddCategory}
              onEditCategory={handleEditCategory}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManager
              onOpenAddCategory={handleOpenAddCategory}
              onEditCategory={handleEditCategory}
            />
          )}

          {activeTab === 'corporate-cards' && (
            <CorporateCardsManager />
          )}

          {activeTab === 'hero' && (
            <HeroManager />
          )}

          {activeTab === 'proposals' && (
            <ProposalsManager />
          )}

          {activeTab === 'orders' && (
            <OrdersManager />
          )}

          {activeTab === 'settings' && (
            <SettingsManager />
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        initialCategory={initialCategory}
        initialSubCategory={initialSubCategory}
      />

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        editingCategory={editingCategory}
      />

      {/* Storage Settings Modal */}
      {isStorageModalOpen && (
        <div className="modal-backdrop active" style={{ display: 'flex' }}>
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsStorageModalOpen(false)}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-header">
              <span style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-gold)' }}>
                STORAGE &amp; CLOUD CONNECTIVITY
              </span>
              <h3 style={{ marginTop: '4px' }}>Backend Storage Infrastructure</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                Verdanta World runs with zero-friction local and cloud persistence.
              </p>
            </div>

            <div style={{ lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '14px', color: '#166534' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.1rem' }}></i>
                <div>
                  <strong>Active Engine: Local &amp; Broadcast Storage</strong>
                  <div style={{ fontSize: '0.78rem' }}>Changes synchronize live across all storefront tabs instantly.</div>
                </div>
              </div>

              <div style={{ background: '#faf9f6', padding: '14px', borderRadius: '8px', border: '1px solid #ebe4d8' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Storage Statistics:</strong>
                <ul style={{ margin: '8px 0 0', paddingLeft: '20px', fontSize: '0.82rem', color: '#555' }}>
                  <li>Active Products: {products.length} items</li>
                  <li>Categories: {categories.length} departments</li>
                  <li>Inquiries: {proposals.length} client dossiers</li>
                  <li>Completed Orders: {orders.length} transactions</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => { setIsStorageModalOpen(false); setActiveTab('settings'); }}
              >
                Configure Settings
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsStorageModalOpen(false)}
                style={{ background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
