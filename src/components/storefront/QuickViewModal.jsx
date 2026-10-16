import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    openProposalModal
  } = useStore();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const sellingPrice = Number(product.price) || 0;
  let mrp = product.mrp && Number(product.mrp) > sellingPrice ? Number(product.mrp) : 0;
  if (!mrp && sellingPrice > 0) {
    mrp = Math.round((sellingPrice * 1.35) / 50) * 50;
    if (mrp <= sellingPrice) mrp = sellingPrice + 500;
  }
  const discountPct = mrp > sellingPrice && mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const savingsAmount = mrp > sellingPrice ? mrp - sellingPrice : 0;

  const handleBulkInquiry = () => {
    setQuickViewProduct(null);
    const notes = `Product Inquiry: ${product.title || product.name} (${product.subItem || product.category})\nOffer Price: ₹${sellingPrice.toLocaleString('en-IN')}\nPlease share minimum order quantities, customization timeline, and enterprise bulk pricing.`;
    openProposalModal(product.title || product.name, notes);
  };

  return (
    <div className="modal-backdrop active" id="quickViewModal">
      <div className="modal-dialog modal-dialog-lg">
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close Quick View"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="quick-view-grid">
          <div className="quick-view-img-col">
            <img
              src={product.image || 'images/wooden-gallery.jpg'}
              alt={product.title || product.name}
              className="quick-view-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'images/wooden-gallery.jpg';
              }}
            />
          </div>

          <div className="quick-view-details">
            <span className="modal-eyebrow">
              {product.category} • {product.subItem}
            </span>
            <h2 className="quick-view-title">{product.title || product.name}</h2>

            {/* Pricing Section */}
            <div className="deal-pricing-container">
              <div className="deal-pricing-row">
                {discountPct > 0 && (
                  <span className="deal-discount-pct">
                    <i className="fa-solid fa-arrow-down"></i>{discountPct}%
                  </span>
                )}
                {mrp > sellingPrice && (
                  <span className="deal-mrp-price">₹{mrp.toLocaleString('en-IN')}</span>
                )}
                <span className="deal-selling-price">{formatPrice(sellingPrice)}</span>
              </div>

              {savingsAmount > 0 && (
                <div className="deal-savings-banner">
                  <i className="fa-solid fa-tag"></i> Special Artisan Offer • You Save ₹{savingsAmount.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <p className="quick-view-desc">
              {product.description ||
                'Thoughtfully handcrafted by skilled Indian craftspeople using time-honored artisanal techniques.'}
            </p>

            <div className="quick-view-specs">
              {product.origin && (
                <div>
                  <strong>Origin:</strong> {product.origin}
                </div>
              )}
              {product.material && (
                <div>
                  <strong>Materials:</strong> {product.material}
                </div>
              )}
              <div>
                <strong>Impact:</strong> Directly supports 10+ artisan craft families
              </div>
            </div>

            <div className="quick-view-actions">
              <button
                type="button"
                className="btn btn-primary quick-view-cart-btn"
                onClick={() => {
                  addToCart(product);
                  setQuickViewProduct(null);
                }}
              >
                <i className="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
              </button>
              <button
                type="button"
                className="btn btn-secondary quick-view-inquiry-btn"
                onClick={handleBulkInquiry}
              >
                Bulk Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
