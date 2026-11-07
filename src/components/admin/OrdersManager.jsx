import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatters';

export default function OrdersManager() {
  const { orders, updateOrderStatus } = useAdmin();

  return (
    <section className="tab-pane active" id="tab-orders">
      <div className="table-card">
        {orders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
            <i className="fa-solid fa-bag-shopping" style={{ fontSize: '2.5rem', color: '#ddd', marginBottom: '12px', display: 'inline-block' }}></i>
            <p>No customer orders placed yet. Orders placed through WhatsApp &amp; Checkout will appear here live in real time.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date &amp; Time</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Order Total</th>
                <th>Fulfillment Status</th>
                <th width="140" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'Recent'}</td>
                  <td>
                    <strong>{o.customerName || 'Direct Store Client'}</strong>
                    {o.customerPhone && <div style={{ fontSize: '0.8rem', color: '#666' }}>{o.customerPhone}</div>}
                  </td>
                  <td>
                    {Array.isArray(o.items) ? (
                      o.items.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '0.82rem' }}>
                          {it.title || it.name} &times; {it.quantity || 1}
                        </div>
                      ))
                    ) : (
                      <span>{o.itemSummary || 'Standard Order'}</span>
                    )}
                  </td>
                  <td><strong style={{ color: 'var(--color-primary)' }}>{formatPrice(o.total || 0)}</strong></td>
                  <td>
                    <select
                      value={o.status || 'Confirmed'}
                      onChange={(e) => updateOrderStatus && updateOrderStatus(o.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        background: o.status === 'Delivered' ? '#dcfce7' : o.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                        color: o.status === 'Delivered' ? '#166534' : o.status === 'Cancelled' ? '#991b1b' : '#92400e'
                      }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => alert(`Order details for #${o.id}\nCustomer: ${o.customerName || 'N/A'}\nTotal: ₹${o.total || 0}\nStatus: ${o.status || 'Confirmed'}`)}
                      style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#fff' }}
                    >
                      <i className="fa-solid fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
