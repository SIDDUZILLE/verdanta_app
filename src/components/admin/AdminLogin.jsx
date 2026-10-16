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
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="brand-monogram">V</span>
          <h2>VERDANTA WORLD</h2>
          <p>Administrative Control & Catalog Management CMS</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Admin Username</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Master Password</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block admin-submit-btn">
            <i className="fa-solid fa-shield-halved"></i> Access Management Portal
          </button>
        </form>

        <div className="admin-login-footer">
          <span className="hint-text">
            Default Credentials: <code>admin</code> / <code>Verdanta@Admin2026</code>
          </span>
          <Link to="/" className="back-to-store-link">
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
