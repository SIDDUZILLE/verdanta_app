/**
 * VERDANTA WORLD - WHATSAPP INTEGRATION HELPERS
 */

export function buildWhatsAppOrderUrl(cartItems, subtotal, whatsappNumber = '918867688699') {
  if (!cartItems || cartItems.length === 0) return '';
  const cleanNumber = String(whatsappNumber).replace(/\D/g, '') || '918867688699';
  
  const itemsText = cartItems.map((item, idx) => {
    return `${idx + 1}. *${item.title}* (${item.subItem || item.category || 'Craft'})\n   Qty: ${item.quantity} × ₹${Number(item.price).toLocaleString('en-IN')} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
  }).join('\n\n');

  const shippingStatus = subtotal >= 2499 ? 'COMPLIMENTARY (FREE)' : 'Standard Delivery';

  const lines = [
    '🌿 *VERDANTA WORLD — ORDER REQUEST* 🌿',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Hello Verdanta Concierge, I would like to place an order for the following artisanal creations:\n',
    itemsText,
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━',
    `💰 *Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`,
    `🚚 *Shipping:* ${shippingStatus}`,
    `📅 *Order Date:* ${new Date().toLocaleString('en-IN')}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Please confirm availability, dispatch timeline, and payment link.\n',
    '_Sent via Verdanta World Online Storefront_'
  ];

  const fullText = lines.join('\n');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(fullText)}`;
}

export function buildWhatsAppInquiryUrl(inquiry, whatsappNumber = '918867688699') {
  const cleanNumber = String(whatsappNumber).replace(/\D/g, '') || '918867688699';
  const lines = [
    '🌿 *NEW CUSTOMER ENQUIRY — VERDANTA WORLD* 🌿',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 *Inquiry ID:* ${inquiry.id || 'INQ-' + Date.now().toString().slice(-5)}`,
    `👤 *Client Name:* ${inquiry.name || 'Client'}`,
    `🏢 *Organization:* ${inquiry.company || 'Private'}`,
    `📞 *Phone:* ${inquiry.phone || 'N/A'}`,
    `✉️ *Email:* ${inquiry.email || 'N/A'}`,
    `🏷️ *Inquiry Type:* ${inquiry.type || 'General Inquiry'}`,
    `📦 *Volume / Budget:* ${inquiry.units || 'N/A'}`,
    `📝 *Customization Details:*\n${inquiry.notes || 'None'}`,
    `📅 *Submitted:* ${new Date().toLocaleString('en-IN')}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    '_Sent via Verdanta World Online Portal_'
  ];

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}
