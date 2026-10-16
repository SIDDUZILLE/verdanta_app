import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export default function ProductCard({ product }) {
  const {
    addToCart,
    setQuickViewProduct,
    openProposalModal,
    wishlist,
    toggleWishlist
  } = useStore();

  if (!product) return null;

  const sellingPrice = Number(product.price) || 0;
  let mrp = product.mrp && Number(product.mrp) > sellingPrice ? Number(product.mrp) : 0;
  if (!mrp && sellingPrice > 0) {
    mrp = Math.round((sellingPrice * 1.35) / 50) * 50;
    if (mrp <= sellingPrice) mrp = sellingPrice + 500;
  }
  const discountPct = mrp > sellingPrice && mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const isWishlisted = wishlist.includes(product.id);

  const handleProposalInquiry = (e) => {
    e.stopPropagation();
    const notes = `Product Inquiry: ${product.title || product.name} (${product.subItem || product.category})\nOffer Price: ₹${sellingPrice.toLocaleString('en-IN')}\nPlease share enterprise bulk quote, branding customization, and lead times.`;
    openProposalModal(product.title || product.name, notes);
  };

  const isB2B = product.channel === 'corporate' || product.channel === 'wholesale' || product.channel === 'export';

  return (
    <div className="product-card" onClick={() => setQuickViewProduct(product)}>
      {/* Product Image Wrap */}
      <div className="product-card-img-wrap">
        <img
          src={product.image || 'images/wooden-gallery.jpg'}
          alt={product.title || product.name}
          loading="lazy"
          className="product-card-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'images/wooden-gallery.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="product-card-top-badges">
          {discountPct > 0 && (
            <span className="card-badge discount-badge">
              <i className="fa-solid fa-arrow-down"></i> {discountPct}% OFF
            </span>
          )}
          {product.badge && <span className="card-badge custom-badge">{product.badge}</span>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label="Wishlist"
        >
          <i className={isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="product-card-overlay">
          <button
            type="button"
            className="card-quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
          >
            <i className="fa-solid fa-eye"></i> Quick View
          </button>
        </div>
      </div>

      {/* Product Info Body */}
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-category-tag">{product.subItem || product.category}</span>
          {product.origin && <span className="product-origin-tag"><i className="fa-solid fa-location-dot"></i> {product.origin}</span>}
        </div>

        <h4 className="product-card-title">{product.title || product.name}</h4>

        {/* Pricing Row */}
        <div className="product-card-price-row">
          <span className="product-selling-price">{formatPrice(sellingPrice)}</span>
          {mrp > sellingPrice && (
            <span className="product-mrp-price">₹{mrp.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Card Actions */}
        <div className="product-card-actions">
          {isB2B ? (
            <button
              type="button"
              className="btn btn-primary card-action-btn"
              onClick={handleProposalInquiry}
            >
              <i className="fa-solid fa-paper-plane"></i> Request Bulk Quote
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <i className="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary card-enquire-btn"
            onClick={handleProposalInquiry}
            title="Custom / Bulk Order Enquiry"
          >
            <i className="fa-regular fa-envelope"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
