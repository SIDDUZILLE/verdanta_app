import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(username, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="admin-auth-overlay" id="adminAuthOverlay" style={{ display: 'flex' }}>
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div
            className="brand-icon-wrap"
            style={{
              width: '58px',
              height: '58px',
              margin: '0 auto 14px',
              background: 'rgba(197, 157, 95, 0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--color-gold)'
            }}
          >
            <svg viewBox="0 0 40 40" width="32" height="32" fill="#c59d5f">
              <path d="M20 2C16.8 2 14.1 3.8 12.8 6.5C11.5 5.6 9.8 5 8 5C4.7 5 2 7.7 2 11C2 13.5 3.5 15.6 5.6 16.5C5.2 17.6 5 18.8 5 20C5 25.5 9.5 30 15 30H18V38H22V30H25C30.5 30 35 25.5 35 20C35 18.8 34.8 17.6 34.4 16.5C36.5 15.6 38 13.5 38 11C38 7.7 35.3 5 32 5C30.2 5 28.5 5.6 27.2 6.5C25.9 3.8 23.2 2 20 2Z" />
            </svg>
          </div>
          <h2 className="admin-auth-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: 'var(--color-primary)', margin: '0 0 4px' }}>
            Verdanta World
          </h2>
          <span
            className="admin-auth-eyebrow"
            style={{
              display: 'block',
              fontSize: '0.68rem',
              letterSpacing: '2px',
              color: 'var(--color-gold)',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            ARTISAN MANAGEMENT CONSOLE
          </span>
          <p className="admin-auth-desc" style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: '0 0 18px' }}>
            Protected Administrative Gateway. Sign in with authorized administrator credentials to manage products, categories &amp; proposals.
          </p>
        </div>

        {error && (
          <div
            className="auth-error-banner"
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        <form className="admin-auth-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="adminAuthUser" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '5px' }}>
              <i className="fa-solid fa-user-shield" style={{ marginRight: '6px', color: 'var(--color-gold)' }}></i>
              Admin Username
            </label>
            <input
              type="text"
              id="adminAuthUser"
              required
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="adminAuthPass" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '5px' }}>
              <i className="fa-solid fa-key" style={{ marginRight: '6px', color: 'var(--color-gold)' }}></i>
              Admin Password
            </label>
            <input
              type="password"
              id="adminAuthPass"
              required
              placeholder="Enter admin password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            id="adminLoginBtn"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '4px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: 'var(--color-gold)',
              borderColor: 'var(--color-gold)',
              color: '#ffffff',
              borderRadius: '6px',
              boxShadow: '0 4px 14px rgba(197, 157, 95, 0.4)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-lock"></i> Authorize &amp; Sign In
          </button>

          <div
            style={{
              marginTop: '16px',
              fontSize: '0.78rem',
              color: '#665',
              background: '#faf7f0',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px dashed #dcd4c5',
              textAlign: 'center',
              lineHeight: '1.5'
            }}
          >
            <strong>Default Admin Credentials:</strong><br />
            Username: <code style={{ background: '#ede6d8', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>admin</code> &bull; Password: <code style={{ background: '#ede6d8', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>Verdanta@Admin2026</code>
          </div>
        </form>

        <div className="admin-auth-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link
            to="/"
            className="auth-return-link"
            style={{
              color: 'var(--color-primary)',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
