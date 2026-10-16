import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import ProductList from '../components/admin/ProductList';
import ProductModal from '../components/admin/ProductModal';
import HeroManager from '../components/admin/HeroManager';
import CorporateCardsManager from '../components/admin/CorporateCardsManager';
import ProposalsManager from '../components/admin/ProposalsManager';
import SettingsManager from '../components/admin/SettingsManager';

export default function AdminPage() {
  const { isAuthenticated, logout, products, proposals, adminToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  return (
    <div className="admin-app-layout">
      {/* Admin Top Navigation */}
      <header className="admin-top-nav">
        <div className="admin-nav-inner">
          <div className="admin-brand">
            <span className="brand-monogram">V</span>
            <div>
              <span className="admin-brand-title">VERDANTA CMS</span>
              <span className="admin-brand-sub">Artisan Management Portal</span>
            </div>
          </div>

          <div className="admin-nav-stats">
            <div className="admin-stat-chip">
              <i className="fa-solid fa-boxes-stacked"></i>
              <span>{products.length} Products</span>
            </div>
            <div className="admin-stat-chip">
              <i className="fa-solid fa-inbox"></i>
              <span>{proposals.length} Inquiries</span>
            </div>
          </div>

          <div className="admin-nav-actions">
            <Link to="/" className="btn btn-sm btn-outline admin-store-btn" target="_blank">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> View Storefront
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-secondary admin-logout-btn"
              onClick={logout}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tab Bar */}
      <div className="admin-tab-bar">
        <div className="admin-tab-container">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="fa-solid fa-boxes-stacked"></i> Products Catalog ({products.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            <i className="fa-solid fa-file-invoice"></i> Inquiries & Leads ({proposals.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <i className="fa-solid fa-image"></i> Hero Banner CMS
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'corporate' ? 'active' : ''}`}
            onClick={() => setActiveTab('corporate')}
          >
            <i className="fa-solid fa-briefcase"></i> Corporate Cards (6)
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fa-solid fa-gear"></i> Store Settings
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <div className="container">
          {activeTab === 'products' && (
            <ProductList
              onOpenAdd={handleOpenAdd}
              onEditProduct={handleEditProduct}
            />
          )}

          {activeTab === 'proposals' && <ProposalsManager />}

          {activeTab === 'hero' && <HeroManager />}

          {activeTab === 'corporate' && <CorporateCardsManager />}

          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
      />

      {/* Admin Toast */}
      {adminToast && (
        <div className="admin-toast show">
          <i className="fa-solid fa-check-circle"></i>
          <span>{adminToast}</span>
        </div>
      )}
    </div>
  );
}
