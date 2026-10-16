import React from 'react';
import Navbar from '../components/storefront/Navbar';
import Hero from '../components/storefront/Hero';
import CategoryPills from '../components/storefront/CategoryPills';
import ProductGrid from '../components/storefront/ProductGrid';
import CorporateSection from '../components/storefront/CorporateSection';
import WholesaleSection from '../components/storefront/WholesaleSection';
import Footer from '../components/storefront/Footer';
import CartDrawer from '../components/storefront/CartDrawer';
import QuickViewModal from '../components/storefront/QuickViewModal';
import ProposalModal from '../components/storefront/ProposalModal';
import VisitModal from '../components/storefront/VisitModal';
import SearchOverlay from '../components/storefront/SearchOverlay';
import { useStore } from '../context/StoreContext';

export default function StorefrontPage() {
  const { toastMessage } = useStore();

  return (
    <div className="storefront-app">
      <Navbar />
      <main>
        <Hero />
        <CategoryPills />
        <ProductGrid />
        <CorporateSection />
        <WholesaleSection />
      </main>
      <Footer />

      {/* Interactive Modals & Drawers */}
      <CartDrawer />
      <QuickViewModal />
      <ProposalModal />
      <VisitModal />
      <SearchOverlay />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast-notification show" id="toastNotification">
          <i className="fa-solid fa-check-circle toast-icon"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
