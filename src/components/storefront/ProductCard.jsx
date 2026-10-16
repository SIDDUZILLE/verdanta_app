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

  const isCorporate = (product.categoryId === 'corporate-gifting' || (product.category && product.category.toLowerCase().includes('corporate')));

  const handleProposalInquiry = (e) => {
    e.stopPropagation();
    const notes = `Product Inquiry: ${product.title || product.name} (${product.subItem || product.category})\nOffer Price: ₹${sellingPrice.toLocaleString('en-IN')}\nPlease share enterprise bulk quote, branding customization, and lead times.`;
    openProposalModal(product.title || product.name, notes);
  };

  return (
    <article
      className={`product-card ${product.outOfStock ? 'is-out-of-stock' : ''}`}
      id={`card-${product.id}`}
      onClick={() => setQuickViewProduct(product)}
    >
      <div className="product-img-box">
        <img
          src={product.image || 'images/wooden-gallery.jpg'}
          alt={product.title || product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'images/wooden-gallery.jpg';
          }}
        />

        <span className="product-badge">{product.badge || 'Artisan Creation'}</span>

        {product.outOfStock ? (
          <span
            className="product-badge product-out-of-stock-badge"
            style={{ background: '#dc3545', color: '#fff', fontWeight: 700 }}
          >
            <i className="fa-solid fa-ban"></i> OUT OF STOCK
          </span>
        ) : null}

        {discountPct > 0 && (
          <span className="product-discount-ribbon">
            <i className="fa-solid fa-arrow-down"></i>{discountPct}% OFF
          </span>
        )}

        <div className="product-quick-actions">
          <button
            type="button"
            className="quick-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
          >
            <i className="fa-regular fa-eye"></i> QUICK VIEW
          </button>

          {isCorporate ? (
            <button
              type="button"
              className="quick-action-btn"
              onClick={handleProposalInquiry}
            >
              <i className="fa-solid fa-file-signature"></i> ENQUIRE
            </button>
          ) : product.outOfStock ? (
            <button
              type="button"
              className="quick-action-btn btn-action-disabled"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            >
              <i className="fa-solid fa-ban"></i> OUT OF STOCK
            </button>
          ) : (
            <button
              type="button"
              className="quick-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <i className="fa-solid fa-plus"></i> ADD TO BAG
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        <span className="product-category-meta">
          {product.category} {product.subItem ? `• ${product.subItem}` : ''}
        </span>
        <h4 className="product-title">{product.title || product.name}</h4>

        <div className="product-price-row">
          <div className="card-deal-pricing">
            <div className="card-deal-row">
              {discountPct > 0 && (
                <span className="card-discount-pct">
                  <i className="fa-solid fa-arrow-down"></i>{discountPct}%
                </span>
              )}
              {mrp > sellingPrice && (
                <span className="card-mrp-price">₹{mrp.toLocaleString('en-IN')}</span>
              )}
              <span className="card-selling-price">{formatPrice(sellingPrice)}</span>
            </div>
          </div>

          {isCorporate ? (
            <button
              type="button"
              className="btn-corporate-mini-enquire"
              onClick={handleProposalInquiry}
              title="Request Corporate Proposal"
            >
              <i className="fa-solid fa-paper-plane"></i> Enquire
            </button>
          ) : product.outOfStock ? (
            <button
              type="button"
              className="add-cart-mini-btn btn-stock-disabled"
              disabled
              title="Out of stock"
              style={{ opacity: 0.5, cursor: 'not-allowed', background: '#e2e8f0', color: '#a0aec0' }}
            >
              <i className="fa-solid fa-ban"></i>
            </button>
          ) : (
            <button
              type="button"
              className="add-cart-mini-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              title="Add to bag"
            >
              <i className="fa-solid fa-bag-shopping"></i>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
