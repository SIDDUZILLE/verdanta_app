import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function CorporateCardsManager() {
  const { corporateCards, saveCorporateCards, uploadImage, showAdminToast } = useAdmin();
  const [cards, setCards] = useState([...corporateCards]);

  const handleCardFieldChange = (cardId, field, value) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, [field]: value } : c));
  };

  const handlePhotoUpload = (cardId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        const finalUrl = await uploadImage(base64);
        setCards(prev => prev.map(c => c.id === cardId ? { ...c, image: finalUrl } : c));
        showAdminToast('Photo uploaded for card!');
      } catch (err) {
        setCards(prev => prev.map(c => c.id === cardId ? { ...c, image: base64 } : c));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, image: c.defaultImage || '' } : c));
    showAdminToast('Reset card photo to default.');
  };

  const handleDeletePhoto = (cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, image: '' } : c));
    showAdminToast('Removed custom photo.');
  };

  const handleSaveSingle = (cardId) => {
    saveCorporateCards(cards);
    showAdminToast('Card saved successfully!');
  };

  const handleSaveAll = () => {
    saveCorporateCards(cards);
    showAdminToast('All 6 Corporate Gifting cards saved successfully!');
  };

  return (
    <section className="tab-pane active" id="tab-corporate-cards">
      {/* Top Header Card */}
      <div
        className="card-mgmt-header"
        style={{
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #ebe4d8',
          padding: '22px 28px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.45rem', margin: 0 }}>
              Corporate Gifting Category Cards (3×2 Grid)
            </h3>
            <span
              className="badge"
              style={{ background: '#e8efe9', color: '#173b2c', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem' }}
            >
              Live Reference Layout
            </span>
          </div>
          <p style={{ color: '#666', margin: 0, fontSize: '0.92rem' }}>
            Upload, replace, and delete photos for each of the six corporate gifting cards. All changes automatically sync to the customer storefront.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href="/#corporate"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
            style={{ background: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Live Store
          </a>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSaveAll}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#fff' }}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> Save All Cards
          </button>
        </div>
      </div>

      {/* Grid of 6 Category Cards */}
      <div
        className="corporate-admin-cards-container"
        id="corporateCardsAdminGrid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}
      >
        {cards.map((card, idx) => {
          const isCustom = Boolean(card.image && card.image !== card.defaultImage && !card.image.includes('corporate/corp-'));
          const displayImg = card.image || card.defaultImage || 'images/corporate-lifestyle.jpg';

          return (
            <div
              key={card.id}
              className="admin-corp-card-box"
              id={`admin-card-${card.id}`}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2dbcf',
                overflow: 'hidden',
                boxShadow: '0 3px 12px rgba(23,59,44,0.06)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {/* Card Top Bar */}
              <div
                style={{
                  padding: '14px 18px',
                  background: '#faf7f0',
                  borderBottom: '1px solid #ebe4d8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    CARD #{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      background: isCustom ? '#dcfce7' : '#fef3c7',
                      color: isCustom ? '#15803d' : '#b45309'
                    }}
                  >
                    {isCustom ? (
                      <><i className="fa-solid fa-check"></i> Custom Photo</>
                    ) : (
                      <><i className="fa-solid fa-image"></i> Reference Photo</>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleResetPhoto(card.id)}
                  title="Reset to original reference photo"
                  style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#fff' }}
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset
                </button>
              </div>

              {/* Photo Box with Instant Upload Overlay */}
              <div style={{ position: 'relative', height: '200px', background: '#f0ece3', overflow: 'hidden' }}>
                <img
                  src={displayImg}
                  alt={card.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = card.defaultImage || 'images/corporate-lifestyle.jpg';
                  }}
                />

                <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 2 }}>
                  <label
                    className="btn btn-sm btn-primary"
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                      padding: '7px 14px',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--color-gold)',
                      borderColor: 'var(--color-gold)',
                      color: '#fff',
                      fontWeight: 700
                    }}
                  >
                    <i className="fa-solid fa-camera"></i> Replace Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoUpload(card.id, e)}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleDeletePhoto(card.id)}
                    title="Delete custom photo"
                    style={{
                      background: '#fff',
                      color: '#b91c1c',
                      borderColor: '#f87171',
                      padding: '7px 11px',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              {/* Card Editable Details Form */}
              <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                    Category Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    onChange={(e) => handleCardFieldChange(card.id, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                    Card Description
                  </label>
                  <textarea
                    rows="2"
                    style={{ fontSize: '0.88rem', lineHeight: 1.45, width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    value={card.description}
                    onChange={(e) => handleCardFieldChange(card.id, 'description', e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#777', marginBottom: '4px' }}>
                    Photo File / URL
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={card.image || ''}
                      style={{ fontSize: '0.8rem', flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      placeholder="Image URL or upload a file above"
                      onChange={(e) => handleCardFieldChange(card.id, 'image', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleSaveSingle(card.id)}
                      title="Save Card"
                      style={{ padding: '6px 12px', fontWeight: 600, background: '#fff', border: '1px solid var(--color-gold)', color: 'var(--color-primary)' }}
                    >
                      <i className="fa-solid fa-check"></i> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
