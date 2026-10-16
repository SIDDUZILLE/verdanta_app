import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatters';

export default function DashboardOverview({ onSwitchTab }) {
  const { products, proposals, orders, categories } = useAdmin();

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const recentProposals = proposals.slice(0, 5);

  return (
    <section className="tab-pane active" id="tab-dashboard">
      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-products">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div className="stat-data">
            <span className="stat-number" id="dashTotalProducts">{products.length}</span>
            <span className="stat-label">Total Products Live</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-proposals">
            <i className="fa-solid fa-file-signature"></i>
          </div>
          <div className="stat-data">
            <span className="stat-number" id="dashTotalProposals">{proposals.length}</span>
            <span className="stat-label">B2B Proposal Inquiries</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orders">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div className="stat-data">
            <span className="stat-number" id="dashTotalOrders">{orders.length}</span>
            <span className="stat-label">Completed Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-revenue">
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div className="stat-data">
            <span className="stat-number" id="dashTotalRevenue">
              {totalRevenue > 0 ? formatPrice(totalRevenue) : '₹0'}
            </span>
            <span className="stat-label">Gross Order Volume</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Overview Split */}
      <div className="dashboard-split-grid">
        {/* Recent Inquiries */}
        <div className="card-panel">
          <div className="panel-header">
            <h3>Recent Proposal Inquiries</h3>
            <button
              type="button"
              className="link-btn"
              onClick={() => onSwitchTab('proposals')}
              style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              View All
            </button>
          </div>
          <div className="panel-body" id="dashRecentProposals">
            {recentProposals.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: '0.88rem' }}>
                No proposal inquiries received yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentProposals.map(p => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#faf9f6',
                      borderRadius: '8px',
                      border: '1px solid #ebe4d8'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{p.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>
                        {p.company} • {p.type}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        background: '#e8efe9',
                        color: '#173b2c'
                      }}
                    >
                      {p.status || 'New'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card-panel">
          <div className="panel-header">
            <h3>Collections Breakdown</h3>
            <span className="panel-tag" style={{ background: '#faf5ea', color: 'var(--color-primary)', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
              {categories.length} Categories
            </span>
          </div>
          <div className="panel-body">
            <ul className="category-breakdown-list" id="categoryBreakdownList" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
              {categories.map(cat => {
                const count = products.filter(p => (p.categoryId || '').toLowerCase() === cat.id.toLowerCase() || (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <li
                    key={cat.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#faf9f6',
                      borderRadius: '6px',
                      border: '1px solid #f0ece3',
                      fontSize: '0.86rem'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{cat.name}</span>
                    <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.74rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                      {count} items
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
