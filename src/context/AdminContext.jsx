import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CATEGORIES, DEFAULT_HERO_DATA } from './StoreContext';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('verdanta_admin_auth') === 'true';
  });

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_products');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_categories');
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  });

  const [proposals, setProposals] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_proposals');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [heroData, setHeroData] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_hero_data');
      return stored ? JSON.parse(stored) : DEFAULT_HERO_DATA;
    } catch (e) {
      return DEFAULT_HERO_DATA;
    }
  });

  const [corporateCards, setCorporateCards] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_corporate_cards');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_config');
      return stored ? JSON.parse(stored) : {
        mongodb_uri: '',
        whatsapp_number: '918867688699',
        admin_username: 'admin',
        admin_password: 'Verdanta@Admin2026'
      };
    } catch (e) {
      return {
        mongodb_uri: '',
        whatsapp_number: '918867688699',
        admin_username: 'admin',
        admin_password: 'Verdanta@Admin2026'
      };
    }
  });

  const [adminToast, setAdminToast] = useState(null);

  const showAdminToast = useCallback((msg) => {
    setAdminToast(msg);
    setTimeout(() => {
      setAdminToast(prev => prev === msg ? null : prev);
    }, 3500);
  }, []);

  // Broadcast helper
  const broadcast = useCallback((data) => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('verdanta_store_channel');
        bc.postMessage({ ...data, timestamp: Date.now() });
        bc.close();
      } catch (e) {}
    }
  }, []);

  // Sync initial datasets if empty
  useEffect(() => {
    if (products.length === 0) {
      fetch('/products.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            localStorage.setItem('verdanta_products', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }

    if (corporateCards.length === 0) {
      fetch('/corporate_cards.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCorporateCards(data);
            localStorage.setItem('verdanta_corporate_cards', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }

    if (proposals.length === 0) {
      fetch('/proposals.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setProposals(data);
            localStorage.setItem('verdanta_proposals', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
  }, [products.length, corporateCards.length, proposals.length]);

  // Auth
  const login = (username, password) => {
    const validUser = config.admin_username || 'admin';
    const validPass = config.admin_password || 'Verdanta@Admin2026';
    if (username.trim() === validUser && password === validPass) {
      setIsAuthenticated(true);
      localStorage.setItem('verdanta_admin_auth', 'true');
      showAdminToast('Welcome back, Admin!');
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin username or password.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('verdanta_admin_auth');
    showAdminToast('Signed out of Admin Portal.');
  };

  // Product CRUD
  const addProduct = (newProduct) => {
    const prod = {
      ...newProduct,
      id: newProduct.id || 'PRD-' + Date.now().toString().slice(-6),
      price: Number(newProduct.price) || 0,
      priceFormatted: `₹${(Number(newProduct.price) || 0).toLocaleString('en-IN')}`,
      createdAt: new Date().toISOString()
    };
    const nextProds = [prod, ...products];
    setProducts(nextProds);
    localStorage.setItem('verdanta_products', JSON.stringify(nextProds));
    broadcast({ type: 'PRODUCTS_UPDATED', products: nextProds });
    showAdminToast(`Product "${prod.title || prod.name}" created successfully!`);

    // Optional server sync
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextProds)
    }).catch(() => {});
  };

  const updateProduct = (updatedProduct) => {
    const nextProds = products.map(p => p.id === updatedProduct.id ? {
      ...p,
      ...updatedProduct,
      price: Number(updatedProduct.price) || 0,
      priceFormatted: `₹${(Number(updatedProduct.price) || 0).toLocaleString('en-IN')}`
    } : p);
    setProducts(nextProds);
    localStorage.setItem('verdanta_products', JSON.stringify(nextProds));
    broadcast({ type: 'PRODUCTS_UPDATED', products: nextProds });
    showAdminToast(`Product updated successfully!`);

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextProds)
    }).catch(() => {});
  };

  const deleteProduct = (productId) => {
    const target = products.find(p => p.id === productId);
    const nextProds = products.filter(p => p.id !== productId);
    setProducts(nextProds);
    localStorage.setItem('verdanta_products', JSON.stringify(nextProds));
    broadcast({ type: 'PRODUCTS_UPDATED', products: nextProds });
    showAdminToast(`Product "${target?.title || productId}" removed from catalog.`);

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextProds)
    }).catch(() => {});
  };

  // Proposal Status Update
  const updateProposalStatus = (id, newStatus) => {
    const nextProposals = proposals.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setProposals(nextProposals);
    localStorage.setItem('verdanta_proposals', JSON.stringify(nextProposals));
    showAdminToast(`Inquiry #${id} marked as "${newStatus}"`);
  };

  // Hero Data Save
  const saveHeroData = (newHero) => {
    setHeroData(newHero);
    localStorage.setItem('verdanta_hero_data', JSON.stringify(newHero));
    broadcast({ type: 'HERO_UPDATED', hero: newHero });
    showAdminToast('Storefront Hero banner updated live!');

    fetch('/api/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHero)
    }).catch(() => {});
  };

  // Corporate Cards Save
  const saveCorporateCards = (newCards) => {
    setCorporateCards(newCards);
    localStorage.setItem('verdanta_corporate_cards', JSON.stringify(newCards));
    broadcast({ type: 'CORPORATE_CARDS_UPDATED', corporateCards: newCards });
    showAdminToast('Corporate Gifting cards updated live!');

    fetch('/api/corporate-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCards)
    }).catch(() => {});
  };

  // Config Save
  const saveConfig = (newConfig) => {
    const nextCfg = { ...config, ...newConfig };
    setConfig(nextCfg);
    localStorage.setItem('verdanta_config', JSON.stringify(nextCfg));
    showAdminToast('System settings saved successfully!');

    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextCfg)
    }).catch(() => {});
  };

  // Image Upload helper (supports Cloudinary or Data URL)
  const uploadImage = async (fileOrDataUrl) => {
    if (!fileOrDataUrl) return '';
    if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:image')) {
      return fileOrDataUrl;
    }

    // 1. Cloudinary check
    const cloudName = (localStorage.getItem('verdanta_cloudinary_cloud_name') || '').trim();
    const uploadPreset = (localStorage.getItem('verdanta_cloudinary_upload_preset') || '').trim();
    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', fileOrDataUrl);
        formData.append('upload_preset', uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.secure_url) {
            return data.secure_url;
          }
        }
      } catch (e) {
        console.warn('Cloudinary upload error:', e);
      }
    }

    // 2. Server API upload check
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: fileOrDataUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.url) return data.url;
      }
    } catch (e) {}

    // Fallback: return data URL directly
    return fileOrDataUrl;
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    products,
    categories,
    proposals,
    orders,
    heroData,
    corporateCards,
    config,
    adminToast,
    showAdminToast,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProposalStatus,
    saveHeroData,
    saveCorporateCards,
    saveConfig,
    uploadImage
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
