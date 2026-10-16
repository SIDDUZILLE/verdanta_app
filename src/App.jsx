import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StorefrontPage from './pages/StorefrontPage';
import AdminPage from './pages/AdminPage';
import { StoreProvider } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';

export default function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<StorefrontPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </StoreProvider>
  );
}
