import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function CorporateCardsManager() {
  const { corporateCards, saveCorporateCards, uploadImage } = useAdmin();
  const [cards, setCards] = useState([...corporateCards]);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const handleEditClick = (card) => {
    setEditingCardId(card.id);
    setEditFormData({ ...card });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        const finalUrl = await uploadImage(base64);
        setEditFormData(prev => ({ ...prev, image: finalUrl }));
      } catch (err) {
        setEditFormData(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const nextCards = cards.map(c => c.id === editFormData.id ? editFormData : c);
    setCards(nextCards);
    saveCorporateCards(nextCards);
    setEditingCardId(null);
    setEditFormData(null);
  };

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <div>
          <h3>Corporate Gifting CMS (6 Reference Cards)</h3>
          <p>Update titles, descriptions, icons, and imagery for your corporate B2B solutions.</p>
        </div>
      </div>

      <div className="admin-corporate-cards-grid">
        {cards.map(card => {
          const isEditing = editingCardId === card.id;

          if (isEditing) {
            return (
              <div key={card.id} className="admin-corp-card editing-card">
                <form onSubmit={handleSaveEdit}>
                  <div className="form-group">
                    <label>Card Title</label>
                    <input
                      type="text"
                      required
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows="2"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>FontAwesome Icon Class</label>
                    <input
                      type="text"
                      value={editFormData.icon}
                      onChange={(e) => setEditFormData({ ...editFormData, icon: e.target.value })}
                      placeholder="fa-solid fa-leaf"
                    />
                  </div>

                  <div className="form-group">
                    <label>Image Source / Upload</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={editFormData.image || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                        placeholder="images/corporate/corp-welcome.jpg"
                      />
                      <label className="btn btn-sm btn-secondary" style={{ cursor: 'pointer' }}>
                        <i className="fa-solid fa-upload"></i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="card-actions" style={{ marginTop: '10px' }}>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingCardId(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            );
          }

          return (
            <div key={card.id} className="admin-corp-card">
              <div className="admin-corp-card-img">
                <img
                  src={card.image || card.defaultImage || 'images/corporate-lifestyle.jpg'}
                  alt={card.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'images/corporate-lifestyle.jpg';
                  }}
                />
              </div>
              <div className="admin-corp-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <i className={card.icon || 'fa-solid fa-leaf'} style={{ color: 'var(--color-gold)' }}></i>
                  <h4>{card.title}</h4>
                </div>
                <p>{card.description}</p>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleEditClick(card)}
                  style={{ marginTop: '8px' }}
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit Card
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
