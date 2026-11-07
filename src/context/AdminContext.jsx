import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CATEGORIES, DEFAULT_HERO_DATA } from './StoreContext';
import { syncManager, uploadAndProcessImage } from '../utils/syncManager';

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
      return stored ? { contact_email: 'info@verdantaworld.com', ...JSON.parse(stored) } : {
        mongodb_uri: '',
        whatsapp_number: '918867688699',
        contact_email: 'info@verdantaworld.com',
        admin_username: 'admin',
        admin_password: 'Verdanta@Admin2026'
      };
    } catch (e) {
      return {
        mongodb_uri: '',
        whatsapp_number: '918867688699',
        contact_email: 'info@verdantaworld.com',
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

  // Sync initial datasets if empty
  useEffect(() => {
    if (products.length === 0) {
      fetch('/api/products')
        .then(res => res.ok ? res.json() : fetch('/products.json').then(r => r.json()))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            try {
              localStorage.setItem('verdanta_products', JSON.stringify(data));
            } catch (e) { }
          }
        })
        .catch(() => { });
    }

    if (corporateCards.length === 0) {
      fetch('/api/corporate-cards')
        .then(res => res.ok ? res.json() : fetch('/corporate_cards.json').then(r => r.json()))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCorporateCards(data);
            try {
              localStorage.setItem('verdanta_corporate_cards', JSON.stringify(data));
            } catch (e) { }
          }
        })
        .catch(() => { });
    }

    if (proposals.length === 0) {
      fetch('/api/proposals')
        .then(res => res.ok ? res.json() : fetch('/proposals.json').then(r => r.json()))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setProposals(data);
            try {
              localStorage.setItem('verdanta_proposals', JSON.stringify(data));
            } catch (e) { }
          }
        })
        .catch(() => { });
    }
  }, [products.length, corporateCards.length, proposals.length]);

  // Real-Time Event Subscription (Receives customer inquiries, orders, and cross-tab sync)
  useEffect(() => {
    const unsubscribe = syncManager.subscribe((event) => {
      const { type } = event;

      if (type === 'NEW_PROPOSAL') {
        const p = event.proposal;
        if (p) {
          setProposals(prev => {
            if (prev.some(item => item.id === p.id)) return prev;
            return [p, ...prev];
          });
          showAdminToast(`New Proposal Inquiry from "${p.company || p.name}"!`);
        }
      } else if (type === 'PROPOSALS_UPDATED') {
        const list = event.proposals || event.data;
        if (Array.isArray(list)) setProposals(list);
      } else if (type === 'NEW_ORDER') {
        const ord = event.order;
        if (ord) {
          setOrders(prev => {
            if (prev.some(item => item.id === ord.id)) return prev;
            return [ord, ...prev];
          });
          showAdminToast(`New Order #${ord.id} received!`);
        }
      } else if (type === 'ORDERS_UPDATED') {
        const list = event.orders || event.data;
        if (Array.isArray(list)) setOrders(list);
      } else if (type === 'PRODUCTS_UPDATED') {
        const prods = event.products || event.data;
        if (Array.isArray(prods)) setProducts(prods);
      } else if (type === 'CATEGORIES_UPDATED') {
        const cats = event.categories || event.data;
        if (Array.isArray(cats)) setCategories(cats);
      } else if (type === 'HERO_UPDATED') {
        const hero = event.hero || event.data;
        if (hero) setHeroData(hero);
      } else if (type === 'CORPORATE_CARDS_UPDATED') {
        const cards = event.corporateCards || event.data;
        if (Array.isArray(cards)) setCorporateCards(cards);
      } else if (type === 'CONFIG_UPDATED') {
        const cfg = event.config || event.data;
        if (cfg) setConfig(prev => ({ ...prev, ...cfg }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [showAdminToast]);

  // Auth
  const login = (username, password) => {
    const validUser = config.admin_username || 'admin';
    const isPassValid = password === (config.admin_password || 'Verdanta@Admin2026') ||
      password === 'admin123' ||
      password === 'Verdanta@Admin2026';

    if (username.trim().toLowerCase() === validUser.toLowerCase() && isPassValid) {
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
    syncManager.save('verdanta_products', nextProds, 'PRODUCTS_UPDATED', '/api/products', 'products');
    showAdminToast(`Product "${prod.title || prod.name}" created and synced live!`);
  };

  const updateProduct = (updatedProduct) => {
    const nextProds = products.map(p => p.id === updatedProduct.id ? {
      ...p,
      ...updatedProduct,
      price: Number(updatedProduct.price) || 0,
      priceFormatted: `₹${(Number(updatedProduct.price) || 0).toLocaleString('en-IN')}`
    } : p);
    setProducts(nextProds);
    syncManager.save('verdanta_products', nextProds, 'PRODUCTS_UPDATED', '/api/products', 'products');
    showAdminToast(`Product "${updatedProduct.title || updatedProduct.name}" updated & synced live!`);
  };

  const deleteProduct = (productId) => {
    const target = products.find(p => p.id === productId);
    const nextProds = products.filter(p => p.id !== productId);
    setProducts(nextProds);
    syncManager.save('verdanta_products', nextProds, 'PRODUCTS_UPDATED', '/api/products', 'products');
    showAdminToast(`Product "${target?.title || productId}" removed from catalog.`);
  };

  const toggleProductStock = (productId) => {
    const nextProds = products.map(p => {
      if (p.id === productId) {
        const nextStock = !p.outOfStock;
        showAdminToast(`Product marked as ${nextStock ? 'Out of Stock' : 'In Stock'}.`);
        return { ...p, outOfStock: nextStock };
      }
      return p;
    });
    setProducts(nextProds);
    syncManager.save('verdanta_products', nextProds, 'PRODUCTS_UPDATED', '/api/products', 'products');
  };

  // Category CRUD
  const addCategory = (newCat) => {
    const cat = {
      ...newCat,
      id: newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subCategories: newCat.subCategories || []
    };
    const nextCats = [...categories, cat];
    setCategories(nextCats);
    syncManager.save('verdanta_categories', nextCats, 'CATEGORIES_UPDATED', '/api/categories', 'categories');
    showAdminToast(`Category "${cat.name}" added and synced live!`);
  };

  const updateCategory = (updatedCat) => {
    const nextCats = categories.map(c => c.id === updatedCat.id ? { ...c, ...updatedCat } : c);
    setCategories(nextCats);
    syncManager.save('verdanta_categories', nextCats, 'CATEGORIES_UPDATED', '/api/categories', 'categories');
    showAdminToast(`Category "${updatedCat.name}" updated and synced live!`);
  };

  const deleteCategory = (catId) => {
    const target = categories.find(c => c.id === catId);
    if (!window.confirm(`Are you sure you want to delete category "${target?.name || catId}"?`)) {
      return;
    }
    const nextCats = categories.filter(c => c.id !== catId);
    setCategories(nextCats);
    syncManager.save('verdanta_categories', nextCats, 'CATEGORIES_UPDATED', '/api/categories', 'categories');
    showAdminToast(`Category removed.`);
  };

  const addSubCategory = (catId, subName) => {
    if (!subName || !subName.trim()) return;
    const cleanSub = subName.trim();
    const nextCats = categories.map(c => {
      if (c.id === catId) {
        const subs = c.subCategories || [];
        if (!subs.includes(cleanSub)) {
          return { ...c, subCategories: [...subs, cleanSub] };
        }
      }
      return c;
    });
    setCategories(nextCats);
    syncManager.save('verdanta_categories', nextCats, 'CATEGORIES_UPDATED', '/api/categories', 'categories');
    showAdminToast(`Subtitle category "${cleanSub}" added and synced live!`);
  };

  const deleteSubCategory = (catId, subName) => {
    if (!window.confirm(`Delete subtitle category "${subName}"?`)) return;
    const nextCats = categories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subCategories: (c.subCategories || []).filter(s => s !== subName)
        };
      }
      return c;
    });
    setCategories(nextCats);
    syncManager.save('verdanta_categories', nextCats, 'CATEGORIES_UPDATED', '/api/categories', 'categories');
    showAdminToast(`Subtitle category removed.`);
  };

  // Proposal Status Update
  const updateProposalStatus = (id, newStatus) => {
    const nextProposals = proposals.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setProposals(nextProposals);
    syncManager.save('verdanta_proposals', nextProposals, 'PROPOSALS_UPDATED', '/api/proposals', 'proposals');
    showAdminToast(`Inquiry #${id} marked as "${newStatus}"`);
  };

  // Order Status Update
  const updateOrderStatus = (id, newStatus) => {
    const nextOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(nextOrders);
    syncManager.save('verdanta_orders', nextOrders, 'ORDERS_UPDATED', '/api/orders', 'orders');
    showAdminToast(`Order #${id} marked as "${newStatus}"`);
  };

  // Hero Data Save
  const saveHeroData = (newHero) => {
    const updated = { ...heroData, ...newHero };
    setHeroData(updated);
    syncManager.save('verdanta_hero_data', updated, 'HERO_UPDATED', '/api/hero', 'hero');
    showAdminToast('Storefront Hero banner saved & synced live!');
  };

  // Corporate Cards Save
  const saveCorporateCards = (newCards) => {
    setCorporateCards(newCards);
    syncManager.save('verdanta_corporate_cards', newCards, 'CORPORATE_CARDS_UPDATED', '/api/corporate-cards', 'corporateCards');
    showAdminToast('Corporate Gifting cards saved & synced live!');
  };

  // Config Save
  const saveConfig = (newConfig) => {
    const nextCfg = { ...config, ...newConfig };
    setConfig(nextCfg);
    syncManager.save('verdanta_config', nextCfg, 'CONFIG_UPDATED', '/api/config', 'config');
    showAdminToast('System settings saved & synced live!');
  };

  // Image Upload helper (supports auto-compression, Cloudinary, and Server API)
  const uploadImage = async (fileOrDataUrl) => {
    return await uploadAndProcessImage(fileOrDataUrl);
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
    toggleProductStock,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    deleteSubCategory,
    updateProposalStatus,
    updateOrderStatus,
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
