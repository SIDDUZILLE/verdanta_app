import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryUrl } from '../../utils/whatsapp';

export default function ProposalModal() {
  const {
    proposalModalData,
    closeProposalModal,
    whatsappNumber,
    showToast
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    type: 'Corporate Gifting',
    units: '50 - 200 units',
    notes: ''
  });

  useEffect(() => {
    if (proposalModalData.isOpen) {
      setFormData(prev => ({
        ...prev,
        type: proposalModalData.title || 'Corporate Gifting',
        notes: proposalModalData.initialNotes || ''
      }));
    }
  }, [proposalModalData]);

  if (!proposalModalData.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProposal = {
      id: 'PRP-' + Math.floor(100000 + Math.random() * 900000),
      name: formData.name.trim() || 'Valued Client',
      company: formData.company.trim() || 'Private Enterprise',
      email: formData.email.trim() || 'Not provided',
      phone: formData.phone.trim() || 'Not provided',
      type: formData.type,
      units: formData.units,
      notes: formData.notes.trim() || 'No specific notes provided.',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    // 1. Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('verdanta_proposals')) || [];
      existing.unshift(newProposal);
      localStorage.setItem('verdanta_proposals', JSON.stringify(existing));
    } catch (err) {}

    // 2. Broadcast to open admin tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('verdanta_store_channel');
        bc.postMessage({ type: 'NEW_PROPOSAL', proposal: newProposal, timestamp: Date.now() });
        bc.close();
      } catch (err) {}
    }

    // 3. Optional Backend API sync
    fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProposal)
    }).catch(() => {});

    // 4. Open WhatsApp
    const waUrl = buildWhatsAppInquiryUrl(newProposal, whatsappNumber);
    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      window.location.href = waUrl;
    }

    alert(
      `Thank you, ${newProposal.name}!\n\nYour proposal inquiry for "${newProposal.company}" has been logged (ID: #${newProposal.id}).\n\nYour inquiry details have been forwarded to our WhatsApp artisan desk for immediate review.`
    );

    showToast(`Inquiry #${newProposal.id} submitted successfully!`);
    closeProposalModal();
  };

  return (
    <div className="modal-backdrop active" id="proposalModal">
      <div className="modal-dialog">
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeProposalModal}
          aria-label="Close Proposal Form"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <span className="modal-eyebrow">ENTERPRISE & WHOLESALE CONCIERGE</span>
        <h2 className="modal-title">
          <i className="fa-solid fa-gift" style={{ color: 'var(--color-gold)', marginRight: '8px' }}></i>
          Request Proposal — {proposalModalData.title || 'Corporate Inquiry'}
        </h2>
        <p className="modal-subtitle">
          Our design consultants curate bespoke artisan collections tailored to your brand, timeline, and budget.
        </p>

        <form onSubmit={handleSubmit} className="proposal-form">
          <div className="form-group-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Radhika Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Organization / Company *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tata Consultancy Services"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Contact Phone (WhatsApp) *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Work Email *</label>
              <input
                type="email"
                required
                placeholder="radhika@organization.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Inquiry Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Employee Welcome & Onboarding">Employee Welcome & Onboarding</option>
                <option value="Employee Recognition & Milestones">Employee Recognition & Milestones</option>
                <option value="Festive & Celebration Gifting">Festive & Celebration Gifting</option>
                <option value="Client, Partner & Executive Gifting">Client, Partner & Executive Gifting</option>
                <option value="Sustainable & ESG Gifting">Sustainable & ESG Gifting</option>
                <option value="Curated & Custom Corporate Gift Sets">Curated & Custom Corporate Gift Sets</option>
                <option value="Wholesale - Wood Crafts">Wholesale - Wood Crafts</option>
                <option value="Wholesale - Metal Crafts">Wholesale - Metal Crafts</option>
                <option value="Global Sourcing & Export">Global Sourcing & Export</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estimated Quantity / Volume</label>
              <select
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              >
                <option value="25 - 50 units (Sample / Pilot)">25 - 50 units (Sample / Pilot)</option>
                <option value="50 - 200 units">50 - 200 units</option>
                <option value="200 - 500 units">200 - 500 units</option>
                <option value="500 - 2,000 units">500 - 2,000 units</option>
                <option value="2,000+ units (Enterprise / Export)">2,000+ units (Enterprise / Export)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Customization Details & Project Notes</label>
            <textarea
              rows="3"
              placeholder="Tell us about your theme, preferred craft materials (terracotta, brass, teakwood), custom laser branding, packaging requirements, or delivery deadlines..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeProposalModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fa-solid fa-paper-plane"></i> Submit Proposal Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
