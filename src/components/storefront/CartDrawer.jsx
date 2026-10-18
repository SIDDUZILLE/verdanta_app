import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { buildWhatsAppOrderUrl } from '../../utils/whatsapp';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
    cartSubtotal,
    whatsappNumber,
    showToast,
    filterByCategory
  } = useStore();

  if (!isCartOpen) return null;

  const threshold = 2499;
  const hasFreeShipping = cartSubtotal >= threshold;
  const diff = threshold - cartSubtotal;
  const progressPct = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const url = buildWhatsAppOrderUrl(cart, cartSubtotal, whatsappNumber);
    window.open(url, '_blank');
  };

  const handleSimulateCheckout = () => {
    if (cart.length === 0) return;
    const orderRecord = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      itemCount: cartItemCount,
      total: cartSubtotal,
      totalFormatted: formatPrice(cartSubtotal),
      status: 'Confirmed',
      customerName: 'Online Shopper',
      createdAt: new Date().toISOString()
    };

    try {
      const orders = JSON.parse(localStorage.getItem('verdanta_orders')) || [];
      orders.unshift(orderRecord);
      localStorage.setItem('verdanta_orders', JSON.stringify(orders));
    } catch (e) {}

    alert(
      `Thank you for choosing authentic Indian artisan crafts!\n\nOrder #${orderRecord.id} Confirmed!\nTotal: ${formatPrice(cartSubtotal)}\n\nOur artisan concierge will proceed with dispatch and tracking.`
    );
    clearCart();
    setIsCartOpen(false);
    showToast(`Order #${orderRecord.id} confirmed!`);
  };

  return (
    <div className="cart-drawer-wrapper">
      {/* Backdrop Overlay */}
      <div
        className="cart-overlay active"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Slide-out Drawer */}
      <div className="cart-drawer active">
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="drawer-title-wrap">
            <i className="fa-solid fa-bag-shopping drawer-bag-icon"></i>
            <h3>Your Shopping Bag</h3>
            <span className="drawer-count-badge">({cartItemCount})</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Shopping Bag"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="shipping-progress-banner">
          <div className="shipping-progress-text">
            {hasFreeShipping ? (
              <span className="unlocked-text">
                <i className="fa-solid fa-circle-check"></i> Complimentary Shipping Unlocked!
              </span>
            ) : (
              <span>
                Add <strong>{formatPrice(diff)}</strong> more for Complimentary Delivery
              </span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-bar"
              style={{
                width: `${progressPct}%`,
                backgroundColor: hasFreeShipping ? '#2c4e3e' : 'var(--color-gold)'
              }}
            ></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <i className="fa-solid fa-bag-shopping empty-cart-icon"></i>
              <h4>Your bag is empty</h4>
              <p>Explore handcrafted earthen terracotta, wooden clocks, and brass heirlooms.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  filterByCategory('all');
                }}
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map(item => {
              const itemImg = item.image && (item.image.startsWith('http') || item.image.startsWith('data:') || item.image.startsWith('/'))
                ? item.image
                : (item.image ? `/${item.image}` : '/images/wooden-gallery.jpg');

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={itemImg}
                    alt={item.title}
                    className="cart-item-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/wooden-gallery.jpg';
                    }}
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <span className="cart-item-meta">{item.subItem || item.category}</span>
                    <div className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-stepper">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-value">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="shipping-note">
              Taxes calculated at dispatch. Guaranteed artisan packaging.
            </p>

            <button
              type="button"
              className="btn btn-whatsapp-checkout"
              onClick={handleWhatsAppCheckout}
            >
              <i className="fa-brands fa-whatsapp"></i> Order Directly via WhatsApp
            </button>

            <button
              type="button"
              className="btn btn-primary btn-block checkout-btn"
              onClick={handleSimulateCheckout}
            >
              <i className="fa-solid fa-lock"></i> Confirm Artisan Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
