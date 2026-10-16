import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function VisitModal() {
  const { isVisitModalOpen, setIsVisitModalOpen, whatsappNumber, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Jaipur Atelier & Craft Studio');
  const [date, setDate] = useState('');

  if (!isVisitModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newVisit = {
      id: 'PRP-VST-' + Math.floor(100000 + Math.random() * 900000),
      name: name.trim() || 'Guest',
      company: `Private Showroom Visit (${location})`,
      email: 'In-Person Appointment',
      phone: phone.trim() || 'Not specified',
      type: 'Showroom Studio Visit',
      units: `Date: ${date || 'Flexible'} at ${location}`,
      notes: `Private atelier appointment requested for ${date || 'Flexible'} at ${location}. Client contact: ${phone}.`,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    try {
      const proposals = JSON.parse(localStorage.getItem('verdanta_proposals')) || [];
      proposals.unshift(newVisit);
      localStorage.setItem('verdanta_proposals', JSON.stringify(proposals));
    } catch (err) {}

    // WhatsApp Notification
    const waLines = [
      '🏛️ *SHOWROOM VISIT APPOINTMENT — VERDANTA WORLD* 🏛️',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      `📋 *Booking ID:* #${newVisit.id}`,
      `👤 *Client Name:* ${newVisit.name}`,
      `📞 *Phone:* ${newVisit.phone}`,
      `📍 *Location:* ${location}`,
      `📅 *Preferred Date:* ${date || 'Flexible'}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      '_Sent via Verdanta World Online Portal_'
    ];
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waLines.join('\n'))}`;

    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      window.location.href = waUrl;
    }

    alert(
      `Thank you, ${newVisit.name}!\n\nYour studio visit appointment request for "${date || 'Flexible'}" at "${location}" has been logged (ID: #${newVisit.id}).\n\nOur hospitality concierge has been notified on WhatsApp.`
    );

    showToast(`Appointment #${newVisit.id} recorded!`);
    setIsVisitModalOpen(false);
  };

  return (
    <div className="modal-backdrop active" id="visitModal">
      <div className="modal-dialog">
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setIsVisitModalOpen(false)}
          aria-label="Close Appointment Modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <span className="modal-eyebrow">IMMERSIVE CRAFT EXPERIENCE</span>
        <h2 className="modal-title">Book an Atelier Experience</h2>
        <p className="modal-subtitle">
          Touch handcrafted terracotta textures, observe live teakwood carving, and discuss bespoke corporate gifting over artisan tea.
        </p>

        <form onSubmit={handleSubmit} className="visit-form">
          <div className="form-group-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Rathore"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>WhatsApp Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Atelier Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Jaipur Atelier & Craft Studio">Jaipur Atelier & Craft Studio</option>
                <option value="Bangalore Experience Centre (Indiranagar)">
                  Bangalore Experience Centre (Indiranagar)
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Visit Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsVisitModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fa-solid fa-calendar-check"></i> Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
