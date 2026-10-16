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

  const exportCSV = () => {
    if (proposals.length === 0) {
      alert('No proposals to export.');
      return;
    }
    const headers = ['Request ID', 'Name', 'Company', 'Email', 'Phone', 'Type', 'Quantity', 'Budget', 'Date', 'Status'];
    const rows = proposals.map(p => [
      p.id,
      `"${p.name || ''}"`,
      `"${p.company || ''}"`,
      `"${p.email || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.type || ''}"`,
      `"${p.units || p.quantity || ''}"`,
      `"${p.budget || ''}"`,
      `"${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}"`,
      `"${p.status || 'New'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verdanta_proposals_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <section className="tab-pane active" id="tab-proposals">
      <div className="table-toolbar">
        <div className="filter-tabs-pills">
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Inquiries ({proposals.length})
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'New' ? 'active' : ''}`}
            onClick={() => setFilterStatus('New')}
          >
            New
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'Under Review' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Under Review')}
          >
            Under Review
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'Proposal Sent' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Proposal Sent')}
          >
            Proposal Sent
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'Closed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Closed')}
          >
            Closed
          </button>
        </div>

        <div className="filter-group">
          <button type="button" className="btn btn-outline" onClick={exportCSV}>
            <i className="fa-solid fa-download"></i> Export CSV
          </button>
        </div>
      </div>

      <div className="table-card">
        {filteredProposals.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
            <i className="fa-solid fa-file-signature" style={{ fontSize: '2.5rem', color: '#ddd', marginBottom: '12px', display: 'inline-block' }}></i>
            <p>No customer proposals found in this category.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Client &amp; Organization</th>
                <th>Contact Info</th>
                <th>Inquiry Type</th>
                <th>Est. Quantity / Budget</th>
                <th>Date</th>
                <th>Status</th>
                <th width="140" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>#{p.id}</strong>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-primary)' }}>{p.name}</strong>
                    {p.company && <div style={{ fontSize: '0.82rem', color: '#666' }}>{p.company}</div>}
                  </td>
                  <td>
                    <div><i className="fa-solid fa-phone" style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}></i> {p.phone}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.email}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#f4efe6', color: 'var(--color-primary)', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>
                      {p.type || 'Custom Inquiries'}
                    </span>
                  </td>
                  <td>
                    {p.units || p.quantity ? <div>{p.units || p.quantity} units</div> : null}
                    {p.budget && <div style={{ fontSize: '0.8rem', color: '#666' }}>₹{p.budget}</div>}
                    {!p.units && !p.quantity && !p.budget && <span style={{ color: '#999' }}>N/A</span>}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#666' }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`status-select status-${(p.status || 'New').toLowerCase().replace(/\s+/g, '-')}`}
                      value={p.status || 'New'}
                      onChange={(e) => updateProposalStatus(p.id, e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 600 }}
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        title="View Full Inquiry Dossier"
                        onClick={() => setSelectedProposal(p)}
                        style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#fff' }}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        title="Chat on WhatsApp"
                        onClick={() => handleWhatsAppContact(p)}
                        style={{ background: '#25D366', color: '#fff', border: 'none', padding: '6px 10px', fontSize: '0.8rem', borderRadius: '4px' }}
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inquiry Detail View Modal */}
      {selectedProposal && (
        <div className="modal-backdrop active" style={{ display: 'flex' }}>
          <div className="modal-dialog" style={{ maxWidth: '600px' }}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProposal(null)}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-header">
              <span style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-gold)' }}>
                INQUIRY DOSSIER #{selectedProposal.id}
              </span>
              <h3 style={{ marginTop: '4px' }}>{selectedProposal.name} — {selectedProposal.company}</h3>
            </div>

            <div style={{ margin: '16px 0', lineHeight: '1.8', fontSize: '0.9rem' }}>
              <div><strong>Client Name:</strong> {selectedProposal.name}</div>
              <div><strong>Company / Organization:</strong> {selectedProposal.company}</div>
              <div><strong>Inquiry Category:</strong> {selectedProposal.type}</div>
              <div><strong>Email:</strong> <a href={`mailto:${selectedProposal.email}`}>{selectedProposal.email}</a></div>
              <div><strong>Phone:</strong> <a href={`tel:${selectedProposal.phone}`}>{selectedProposal.phone}</a></div>
              {selectedProposal.units && <div><strong>Estimated Units:</strong> {selectedProposal.units}</div>}
              {selectedProposal.budget && <div><strong>Target Budget:</strong> ₹{selectedProposal.budget}</div>}
              {selectedProposal.timeline && <div><strong>Timeline:</strong> {selectedProposal.timeline}</div>}
              {selectedProposal.requirements && (
                <div style={{ marginTop: '12px', background: '#faf8f5', padding: '12px', borderRadius: '6px', border: '1px solid #ebe4d8' }}>
                  <strong>Client Brief &amp; Customization Notes:</strong>
                  <p style={{ margin: '6px 0 0', whiteSpace: 'pre-line' }}>{selectedProposal.requirements}</p>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handleWhatsAppContact(selectedProposal)}
                style={{ background: '#25D366', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedProposal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
