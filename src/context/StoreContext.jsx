import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { normalizeCategoryId } from '../utils/formatters';

const StoreContext = createContext(null);

export const DEFAULT_CATEGORIES = [
  {
    id: 'artisan-gallery',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Artisan Gallery',
    displayName: '1. Artisan Gallery',
    badge: 'Collection 01',
    description: 'Earthen terracotta vases, sculpted clay urns, ambient lamps, and organic sabai grass handwoven creations.',
    icon: 'fa-palette',
    image: 'images/artisan-gallery.jpg',
    subCategories: [
      'Lamps & Ambient Lighting',
      'Terracotta & Clay Crafts',
      'Handwoven',
      'Cane crafts',
      'Artisan Décor'
    ]
  },
  {
    id: 'wooden-gallery',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Wooden Crafts',
    displayName: '2. Wooden Crafts',
    badge: 'Collection 02',
    description: 'Artisanal carved teakwood clocks, keychains, traditional toys, tea-light candles & wooden décor.',
    icon: 'fa-tree',
    image: 'images/wooden-gallery.jpg',
    subCategories: [
      'Toys',
      'Keychains & Mini Gifts',
      'Tea-Light Candles',
      'Wooden Clocks',
      'Wooden Decor'
    ]
  },
  {
    id: 'premium-home-decor',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Premium Home Décor',
    displayName: '3. Premium Home Décor',
    badge: 'Collection 03',
    description: 'Sculptural brass accents, hammered urlis, wall tapestries, and tabletop statement pieces.',
    icon: 'fa-couch',
    image: 'images/premium-decor.jpg',
    subCategories: [
      'Table Décor',
      'Wall Décor',
      'Traditional & Heritage Décor',
      'Sculptures & Figurines'
    ]
  },
  {
    id: 'personalization-gifting',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Gifting',
    displayName: '4. Gifting',
    badge: 'Collection 04',
    description: 'Artisan return gifts, festive boxes, curated gift sets, eco-friendly gifts & bespoke keepsakes.',
    icon: 'fa-gift',
    image: 'images/personalization.jpg',
    subCategories: [
      'Return Gifts',
      'Festive Gifts',
      'Curated Gift Sets',
      'Eco-Friendly Gifts',
      'Occasion Gifts'
    ]
  },
  {
    id: 'corporate-gifting',
    channel: 'corporate',
    channelName: 'Corporate Gifting',
    name: 'Corporate Gifting',
    displayName: 'Corporate Gifting (6 Categories)',
    badge: 'Corporate B2B',
    description: 'Curated corporate gifting, employee onboarding, milestones, festive hampers & ESG sustainable partner gifts.',
    icon: 'fa-briefcase',
    image: 'images/corporate-lifestyle.jpg',
    subCategories: [
      'Employee Welcome & Onboarding',
      'Employee Recognition & Milestones',
      'Festive & Celebration Gifting',
      'Client, Partner & Executive Gifting',
      'Sustainable & ESG Gifting',
      'Curated & Custom Corporate Gift Sets'
    ]
  },
  {
    id: 'wholesale-wood',
    channel: 'wholesale',
    channelName: 'Wholesale',
    name: 'Wholesale Wood Crafts',
    displayName: 'Wholesale - Wood Crafts',
    badge: 'Wholesale Wood',
    description: 'Handmade wooden crafts at B2B wholesale prices for gift stores, retailers, interior designers, and corporate suppliers.',
    icon: 'fa-boxes-stacked',
    image: 'images/wholesale.jpg',
    subCategories: [
      'Wooden Decorative Boxes',
      'Handcrafted Keychains',
      'Tea-Light Candle Holders',
      'Wall Clocks',
      'Wooden Games & Toys'
    ]
  },
  {
    id: 'wholesale-metal',
    channel: 'wholesale',
    channelName: 'Wholesale',
    name: 'Wholesale Metal Crafts',
    displayName: 'Wholesale - Metal Crafts',
    badge: 'Wholesale Metal',
    description: 'Handcrafted solid brass and metal crafts for wholesale retailers, gift shops and interior designers.',
    icon: 'fa-gem',
    image: 'images/wholesale.jpg',
    subCategories: [
      'Radha Krishna',
      'Buddha',
      'Musician Sets',
      'Elephant & Animal',
      'Artistic Wall Décor'
    ]
  },
  {
    id: 'export-wood',
    channel: 'export',
    channelName: 'Export',
    name: 'Export Wood Crafts',
    displayName: 'Export - Wood Crafts',
    badge: 'Export Wood',
    description: 'International export supply for global retailers, distributors, hospitality and lifestyle brands.',
    icon: 'fa-earth-americas',
    image: 'images/global-sourcing.jpg',
    subCategories: [
      'Wooden Decorative Trays',
      'Wooden Boxes & Organisers',
      'Wooden Tea-Light Holders',
      'Figurines & Sculptural Décor',
      'Traditional Toys & Play Objects'
    ]
  },
  {
    id: 'export-metal',
    channel: 'export',
    channelName: 'Export',
    name: 'Export Metal Crafts',
    displayName: 'Export - Metal Crafts',
    badge: 'Export Metal',
    description: 'Global export consignments of handcrafted brass statues, wall art, and ambient tea-light holders.',
    icon: 'fa-plane-departure',
    image: 'images/global-sourcing.jpg',
    subCategories: [
      'Metal Sculptural Figurines',
      'Metal Table & Wall Décor',
      'Candle / Tea-Light Holders',
      'Indian Musician Sets'
    ]
  }
];

export const DEFAULT_HERO_DATA = {
  eyebrow: "ARTISANAL EXCELLENCE • DIRECT FROM INDIA",
  title: "CRAFTED BY ARTISANS.\nINSPIRED BY INDIA.\nMADE MEANINGFUL.",
  description: "Discover thoughtfully crafted home décor and meaningful gifts that celebrate Indian craftsmanship, empower artisans and inspire more sustainable living.",
  image: "images/hero.jpg",
  defaultImage: "images/hero.jpg",
  primaryBtnText: "SHOP COLLECTIONS",
  primaryBtnLink: "#categories",
  secondaryBtnText: "REQUEST A PROPOSAL",
  secondaryBtnLink: "modal:proposal"
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [heroData, setHeroData] = useState(DEFAULT_HERO_DATA);
  const [corporateCards, setCorporateCards] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('918867688699');

  // Filter & Search states
  const [activeChannel, setActiveChannel] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Wishlist state
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('verdanta_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [proposalModalData, setProposalModalData] = useState({ isOpen: false, title: 'General Inquiry', initialNotes: '' });
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show Toast
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('verdanta_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('verdanta_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Initial Load from JSON / localStorage / API
  useEffect(() => {
    // 1. Products
    const cachedProducts = localStorage.getItem('verdanta_products');
    if (cachedProducts) {
      try {
        const parsed = JSON.parse(cachedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      } catch (e) {}
    }
    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(prev => prev.length > 0 ? prev : data);
          if (!cachedProducts) {
            localStorage.setItem('verdanta_products', JSON.stringify(data));
          }
        }
      })
      .catch(err => console.warn('Could not load products.json:', err));

    // 2. Categories
    const cachedCats = localStorage.getItem('verdanta_categories');
    if (cachedCats) {
      try {
        const parsed = JSON.parse(cachedCats);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      } catch (e) {}
    } else {
      fetch('/categories.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            localStorage.setItem('verdanta_categories', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }

    // 3. Hero Data
    const cachedHero = localStorage.getItem('verdanta_hero_data');
    if (cachedHero) {
      try {
        const parsed = JSON.parse(cachedHero);
        if (parsed && typeof parsed === 'object') setHeroData(parsed);
      } catch (e) {}
    } else {
      fetch('/hero.json')
        .then(res => res.json())
        .then(data => {
          if (data && typeof data === 'object') {
            setHeroData({ ...DEFAULT_HERO_DATA, ...data });
            localStorage.setItem('verdanta_hero_data', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }

    // 4. Corporate Cards
    const cachedCorp = localStorage.getItem('verdanta_corporate_cards');
    if (cachedCorp) {
      try {
        const parsed = JSON.parse(cachedCorp);
        if (Array.isArray(parsed) && parsed.length > 0) setCorporateCards(parsed);
      } catch (e) {}
    }
    fetch('/corporate_cards.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCorporateCards(prev => prev.length > 0 ? prev : data);
          if (!cachedCorp) {
            localStorage.setItem('verdanta_corporate_cards', JSON.stringify(data));
          }
        }
      })
      .catch(() => {});

    // 5. Config (WhatsApp Number)
    fetch('/config.json')
      .then(res => res.json())
      .then(cfg => {
        if (cfg && cfg.whatsapp_number) {
          setWhatsappNumber(String(cfg.whatsapp_number).replace(/\D/g, ''));
        }
      })
      .catch(() => {});
  }, []);

  // BroadcastChannel for Live Sync across tabs
  useEffect(() => {
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('verdanta_store_channel');
      bc.onmessage = (event) => {
        const { type, products: updatedProds, hero, corporateCards: updatedCorp, categories: updatedCats } = event.data || {};
        if (type === 'PRODUCTS_UPDATED' && Array.isArray(updatedProds)) {
          setProducts(updatedProds);
          showToast('Store catalog updated live from Admin!');
        } else if (type === 'HERO_UPDATED' && hero) {
          setHeroData(hero);
        } else if (type === 'CORPORATE_CARDS_UPDATED' && Array.isArray(updatedCorp)) {
          setCorporateCards(updatedCorp);
        } else if (type === 'CATEGORIES_UPDATED' && Array.isArray(updatedCats)) {
          setCategories(updatedCats);
        }
      };
    }
    return () => {
      if (bc) bc.close();
    };
  }, [showToast]);

  // Cart Operations
  const addToCart = useCallback((product, qty = 1) => {
    if (!product) return;
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, {
        id: product.id,
        title: product.title || product.name,
        price: Number(product.price) || 0,
        priceFormatted: product.priceFormatted || `₹${Number(product.price).toLocaleString('en-IN')}`,
        image: product.image,
        category: product.category,
        subItem: product.subItem,
        quantity: qty
      }];
    });
    showToast(`"${product.title || product.name}" added to your shopping bag!`);
    setIsCartOpen(true);
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId, delta) => {
    setCart(prev => {
      const target = prev.find(i => i.id === productId);
      if (!target) return prev;
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        return prev.filter(i => i.id !== productId);
      }
      return prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist toggle
  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from wishlist' : 'Added to your wishlist!');
      return next;
    });
  }, [showToast]);

  // Filter helpers
  const filterByChannel = useCallback((channel) => {
    setActiveChannel(channel);
    setActiveCategory('all');
    setActiveSubCategory(null);
  }, []);

  const filterByCategory = useCallback((categoryId, subCat = null) => {
    setSearchQuery('');
    if (!categoryId || categoryId === 'all') {
      setActiveCategory('all');
      setActiveSubCategory(null);
      setActiveChannel('all');
    } else {
      const normId = normalizeCategoryId(categoryId);
      setActiveCategory(normId);
      setActiveSubCategory(subCat && typeof subCat === 'string' && subCat.trim() ? subCat.trim() : null);

      if (normId.startsWith('wholesale')) {
        setActiveChannel('wholesale');
      } else if (normId.startsWith('export')) {
        setActiveChannel('export');
      } else if (normId === 'corporate-gifting') {
        setActiveChannel('corporate');
      } else {
        setActiveChannel('all');
      }
    }

    const catElem = document.getElementById('categories');
    if (catElem) {
      catElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Open Corporate Gifting with smooth scroll and card highlight
  const openCorporateGifting = useCallback((targetSubCategory = 'all') => {
    const section = document.getElementById('corporate');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (targetSubCategory && targetSubCategory !== 'all') {
      const targetLower = targetSubCategory.toLowerCase().trim();
      const card = corporateCards.find(c =>
        c.id === targetSubCategory ||
        (c.categoryKey && c.categoryKey.toLowerCase() === targetLower) ||
        (c.title && c.title.toLowerCase() === targetLower)
      );
      if (card) {
        setTimeout(() => {
          const el = document.getElementById('card-' + card.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlight-active');
            setTimeout(() => el.classList.remove('highlight-active'), 2500);
          }
        }, 350);
      }
    }
  }, [corporateCards]);

  // Open Proposal Modal helper
  const openProposalModal = useCallback((title = 'General Inquiry', initialNotes = '') => {
    setProposalModalData({ isOpen: true, title, initialNotes });
  }, []);

  const closeProposalModal = useCallback(() => {
    setProposalModalData({ isOpen: false, title: 'General Inquiry', initialNotes: '' });
  }, []);

  // Totals calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    products,
    setProducts,
    categories,
    heroData,
    corporateCards,
    whatsappNumber,
    activeChannel,
    activeCategory,
    activeSubCategory,
    searchQuery,
    setSearchQuery,
    cart,
    wishlist,
    cartItemCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    quickViewProduct,
    setQuickViewProduct,
    proposalModalData,
    openProposalModal,
    closeProposalModal,
    openCorporateGifting,
    isVisitModalOpen,
    setIsVisitModalOpen,
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    toastMessage,
    showToast,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    filterByChannel,
    filterByCategory,
    setActiveSubCategory
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
