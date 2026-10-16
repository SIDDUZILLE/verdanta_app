import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatters';

export default function OrdersManager() {
  const { orders } = useAdmin();

  return (
    <section className="tab-pane active" id="tab-orders">
      <div className="table-card">
        {orders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
            <i className="fa-solid fa-bag-shopping" style={{ fontSize: '2.5rem', color: '#ddd', marginBottom: '12px', display: 'inline-block' }}></i>
            <p>No customer orders placed yet. Orders placed through WhatsApp &amp; Checkout will appear here.</p>
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
                <th width="100" style={{ textAlign: 'right' }}>Action</th>
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
                    <span className="badge" style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {o.status || 'Received'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => alert(`Order details for #${o.id}\nCustomer: ${o.customerName || 'N/A'}\nTotal: ₹${o.total || 0}`)}
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
