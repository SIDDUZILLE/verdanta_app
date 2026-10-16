import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function ShowroomSection() {
  const { setIsVisitModalOpen, whatsappNumber } = useStore();

  return (
    <section className="showroom-section" id="visit-us" style={{ backgroundImage: "url('images/showroom-store.jpg')" }}>
      <div className="showroom-overlay"></div>
      <div className="container showroom-container">
        <div className="showroom-wrapper">
          <div className="showroom-content">
            <span className="showroom-tag">FLAGSHIP CRAFT EXPERIENCES</span>
            <h2 className="showroom-title">VISIT OUR SHOWROOM</h2>
            <p className="showroom-text">
              Experience the tactile warmth of handcrafted pottery, carved rosewood clocks, natural grass weaves, and bespoke gift collections in person. Meet our master artisan curators in Jaipur and Bangalore.
            </p>
            <div className="showroom-locations">
              <div className="location-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <strong>Jaipur Atelier &amp; Design Studio</strong>
                  <span>Civil Lines, Jaipur, Rajasthan 302006</span>
                </div>
              </div>
              <div className="location-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <strong>Bangalore Experience Centre</strong>
                  <span>
                    <a
                      href="https://maps.app.goo.gl/5ZTcvKAGmps1qPbG7?g_st=aw"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
                      Indiranagar 100ft Road, Bengaluru (Open in Maps)
                    </a>
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      fontSize: '0.85rem',
                      color: 'var(--color-primary)',
                      fontWeight: 600
                    }}
                  >
                    <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>{' '}
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      +91 88676 88699
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="showroom-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsVisitModalOpen(true)}
              >
                SCHEDULE A PRIVATE VISIT
              </button>
              <a
                href="https://maps.app.goo.gl/5ZTcvKAGmps1qPbG7?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                GET DIRECTIONS <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
