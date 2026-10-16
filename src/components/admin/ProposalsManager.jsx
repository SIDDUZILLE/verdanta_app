import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function ProposalsManager() {
  const { proposals, updateProposalStatus } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState(null);

  const filteredProposals = proposals.filter(p => {
    if (filterStatus === 'all') return true;
    return (p.status || 'New').toLowerCase() === filterStatus.toLowerCase();
  });

  const handleWhatsAppContact = (proposal) => {
    const phone = String(proposal.phone || '').replace(/\D/g, '');
    if (!phone) {
      alert('No valid phone number found for this inquiry.');
      return;
    }
    const msg = `Hello ${proposal.name}, this is the Verdanta World Artisan Concierge regarding your inquiry #${proposal.id} for "${proposal.company}". We would love to discuss your custom craft requirements.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <div>
          <h3>Customer Proposals & Inquiries ({proposals.length})</h3>
          <p>Track B2B corporate gifting leads, wholesale requests, and private atelier visits.</p>
        </div>

        <div className="filter-status-pills">
          {['all', 'New', 'Contacted', 'In Progress', 'Completed'].map(st => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterStatus(st)}
            >
              {st === 'all' ? 'All Inquiries' : st}
            </button>
          ))}
        </div>
      </div>

      {filteredProposals.length === 0 ? (
        <div className="admin-empty-table">
          <i className="fa-solid fa-inbox"></i>
          <p>No customer proposals found in this category.</p>
        </div>
      ) : (
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client / Organization</th>
                <th>Category</th>
                <th>Volume</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>#{p.id}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                    </div>
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '0.82rem', color: '#555' }}>{p.company}</div>
                  </td>
                  <td>
                    <span className="badge-category">{p.type}</span>
                  </td>
                  <td>{p.units || 'N/A'}</td>
                  <td>
                    <div><i className="fa-solid fa-phone" style={{ fontSize: '0.75rem' }}></i> {p.phone}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.email}</div>
                  </td>
                  <td>
                    <select
                      className={`status-select status-${(p.status || 'New').toLowerCase().replace(/\s+/g, '-')}`}
                      value={p.status || 'New'}
                      onChange={(e) => updateProposalStatus(p.id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        title="View Details"
                        onClick={() => setSelectedProposal(p)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-whatsapp"
                        title="Chat on WhatsApp"
                        onClick={() => handleWhatsAppContact(p)}
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inquiry Detail View Modal */}
      {selectedProposal && (
        <div className="modal-backdrop active">
          <div className="modal-dialog">
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedProposal(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <span className="modal-eyebrow">INQUIRY DOSSIER #{selectedProposal.id}</span>
            <h2 className="modal-title">{selectedProposal.name} — {selectedProposal.company}</h2>

            <div className="inquiry-detail-body" style={{ margin: '16px 0', lineHeight: '1.7' }}>
              <div><strong>Inquiry Category:</strong> {selectedProposal.type}</div>
              <div><strong>Requested Volume:</strong> {selectedProposal.units}</div>
              <div><strong>Contact Phone:</strong> {selectedProposal.phone}</div>
              <div><strong>Email Address:</strong> {selectedProposal.email}</div>
              <div style={{ marginTop: '12px' }}>
                <strong>Client Specifications & Notes:</strong>
                <p style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                  {selectedProposal.notes || 'None provided.'}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedProposal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleWhatsAppContact(selectedProposal)}
              >
                <i className="fa-brands fa-whatsapp"></i> Chat with Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
