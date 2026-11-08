/**
 * VERDANTA WORLD - REAL-TIME STORE SYNCHRONIZATION MANAGER
 * Coordinates instant real-time synchronization between Admin and Customer Dashboards:
 * 1. In-memory same-tab reactivity (CustomEvent)
 * 2. Cross-tab real-time reactivity (BroadcastChannel + storage event fallback)
 * 3. Server persistence & cross-device synchronization (/api/ endpoints + polling heartbeat)
 * 4. Image compression & upload handler to prevent quota issues and preserve speed
 */

const CHANNEL_NAME = 'verdanta_store_channel';
const LOCAL_EVENT_NAME = 'verdanta_local_sync';

class StoreSyncManager {
  constructor() {
    this.subscribers = new Set();
    this.lastProcessedTimestamps = {};
    this.bc = null;
    this.pollingTimer = null;
    this.serverTimestamps = {};

    this.initBroadcastChannel();
    this.initLocalListeners();
  }

  initBroadcastChannel() {
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      try {
        this.bc = new BroadcastChannel(CHANNEL_NAME);
        this.bc.onmessage = (event) => {
          if (event && event.data) {
            this.handleIncomingEvent(event.data, 'broadcast');
          }
        };
      } catch (err) {
        console.warn('[SyncManager] BroadcastChannel unavailable, using storage events.', err);
      }
    }
  }

  initLocalListeners() {
    if (typeof window === 'undefined') return;

    // 1. Same-tab local CustomEvent listener
    window.addEventListener(LOCAL_EVENT_NAME, (event) => {
      if (event && event.detail) {
        this.handleIncomingEvent(event.detail, 'local');
      }
    });

    // 2. Cross-tab localStorage event listener (robust fallback)
    window.addEventListener('storage', (event) => {
      if (!event.key) return;

      if (event.key === 'verdanta_products') {
        try {
          const prods = JSON.parse(event.newValue || '[]');
          this.handleIncomingEvent({ type: 'PRODUCTS_UPDATED', products: prods, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      } else if (event.key === 'verdanta_categories') {
        try {
          const cats = JSON.parse(event.newValue || '[]');
          this.handleIncomingEvent({ type: 'CATEGORIES_UPDATED', categories: cats, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      } else if (event.key === 'verdanta_hero_data') {
        try {
          const hero = JSON.parse(event.newValue || '{}');
          this.handleIncomingEvent({ type: 'HERO_UPDATED', hero, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      } else if (event.key === 'verdanta_corporate_cards') {
        try {
          const cards = JSON.parse(event.newValue || '[]');
          this.handleIncomingEvent({ type: 'CORPORATE_CARDS_UPDATED', corporateCards: cards, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      } else if (event.key === 'verdanta_config') {
        try {
          const cfg = JSON.parse(event.newValue || '{}');
          this.handleIncomingEvent({ type: 'CONFIG_UPDATED', config: cfg, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      } else if (event.key === 'verdanta_proposals') {
        try {
          const props = JSON.parse(event.newValue || '[]');
          this.handleIncomingEvent({ type: 'PROPOSALS_UPDATED', proposals: props, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      } else if (event.key === 'verdanta_orders') {
        try {
          const ords = JSON.parse(event.newValue || '[]');
          this.handleIncomingEvent({ type: 'ORDERS_UPDATED', orders: ords, timestamp: Date.now() }, 'storage');
        } catch (e) {}
      }
    });
  }

  handleIncomingEvent(eventData, source = 'unknown') {
    if (!eventData) return;
    const rawType = String(eventData.type || '').trim().toUpperCase();
    if (!rawType) return;

    // Deduplicate rapid identical events within 60ms
    const eventKey = `${rawType}_${eventData.timestamp || eventData.time || ''}`;
    const now = Date.now();
    if (this.lastProcessedTimestamps[eventKey] && (now - this.lastProcessedTimestamps[eventKey] < 80)) {
      return;
    }
    this.lastProcessedTimestamps[eventKey] = now;

    // Clean up old deduplication cache
    if (Object.keys(this.lastProcessedTimestamps).length > 200) {
      this.lastProcessedTimestamps = {};
    }

    // Normalized event payload for compatibility across all tabs and scripts
    const normalizedEvent = {
      ...eventData,
      type: rawType,
      products: eventData.products || (rawType.includes('PRODUCT') ? eventData.data : null),
      categories: eventData.categories || (rawType.includes('CATEGOR') ? eventData.data : null),
      hero: eventData.hero || (rawType.includes('HERO') ? eventData.data : null),
      corporateCards: eventData.corporateCards || eventData.cards || (rawType.includes('CORPORATE') ? eventData.data : null),
      config: eventData.config || (rawType.includes('CONFIG') ? eventData.data : null),
      proposals: eventData.proposals || (rawType.includes('PROPOSAL') ? eventData.data : null),
      orders: eventData.orders || (rawType.includes('ORDER') ? eventData.data : null)
    };

    // Notify all active subscribers in React contexts
    this.subscribers.forEach((callback) => {
      try {
        callback(normalizedEvent, source);
      } catch (err) {
        console.error('[SyncManager] Error in subscriber callback:', err);
      }
    });
  }

  /**
   * Dispatches an event to BOTH the current window/tab AND all other windows/tabs in real time.
   */
  dispatch(type, payload = {}) {
    const timestamp = Date.now();
    const eventData = {
      type,
      timestamp,
      ...payload
    };

    // 1. Send to all other tabs via BroadcastChannel
    if (this.bc) {
      try {
        this.bc.postMessage(eventData);
      } catch (e) {
        console.warn('[SyncManager] BroadcastChannel dispatch failed:', e);
      }
    }

    // 2. Send to current tab via CustomEvent
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(LOCAL_EVENT_NAME, { detail: eventData }));
    }
  }

  /**
   * Subscribe to real-time events. Returns an unsubscribe function.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Saves dataset to localStorage with timestamp, syncs to API backend, and dispatches real-time broadcast.
   */
  save(key, data, eventType, apiEndpoint = null, apiDataKey = null) {
    const timestamp = Date.now();

    // 1. Save to LocalStorage safely
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_timestamp`, String(timestamp));
    } catch (err) {
      console.warn(`[SyncManager] LocalStorage write warning for ${key}:`, err);
    }

    // 2. Dispatch real-time synchronization to all tabs and local window
    const payload = {};
    if (apiDataKey) {
      payload[apiDataKey] = data;
    } else {
      payload.data = data;
    }
    this.dispatch(eventType, payload);

    // 3. Persist to API backend asynchronously
    if (apiEndpoint && typeof fetch !== 'undefined') {
      fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch((err) => {
        // Silent catch for offline or static deployments
      });
    }
  }

  /**
   * Start periodic background check to detect changes made by another device or server.
   */
  startBackgroundSync(onServerChange, intervalMs = 4000) {
    if (typeof window === 'undefined' || this.pollingTimer) return;

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/sync-status', { cache: 'no-store' });
        if (!res.ok) return;
        const status = await res.json();
        if (status && status.timestamps) {
          let hasDiff = false;
          for (const [entity, ts] of Object.entries(status.timestamps)) {
            const lastTs = this.serverTimestamps[entity] || 0;
            if (lastTs && ts > lastTs) {
              hasDiff = true;
            }
            this.serverTimestamps[entity] = ts;
          }
          if (hasDiff && typeof onServerChange === 'function') {
            onServerChange(status);
          }
        }
      } catch (e) {
        // Offline or endpoint absent
      }
    };

    this.pollingTimer = setInterval(checkStatus, intervalMs);

    // Also check on tab focus / document visibility change
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkStatus();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', checkStatus);

    return () => {
      if (this.pollingTimer) clearInterval(this.pollingTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', checkStatus);
    };
  }
}

export const syncManager = new StoreSyncManager();

/**
 * Client-side image compression to guarantee crisp photos without exceeding localStorage limits or bandwidth.
 */
export async function compressImage(fileOrDataUrl, maxWidth = 1400, maxHeight = 1400, quality = 0.85) {
  if (!fileOrDataUrl) return '';

  // If already a clean relative or hosted URL, no compression needed
  if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:image')) {
    return fileOrDataUrl;
  }

  return new Promise((resolve) => {
    let dataUrlPromise;

    if (typeof fileOrDataUrl === 'string') {
      dataUrlPromise = Promise.resolve(fileOrDataUrl);
    } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
      dataUrlPromise = new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target.result);
        reader.onerror = rej;
        reader.readAsDataURL(fileOrDataUrl);
      });
    } else {
      return resolve(fileOrDataUrl);
    }

    dataUrlPromise
      .then((dataUrl) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Only resize if exceeds max dimensions
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          // Smooth resampling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      })
      .catch(() => resolve(fileOrDataUrl));
  });
}

/**
 * Universal image upload helper:
 * 1. Compresses photo on client.
 * 2. Checks Cloudinary if configured.
 * 3. Tries backend `/api/upload-image` endpoint.
 * 4. Falls back to compressed data URL.
 */
export async function uploadAndProcessImage(fileOrDataUrl) {
  if (!fileOrDataUrl) return '';

  // Already a permanent URL
  if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:image')) {
    return fileOrDataUrl;
  }

  // 1. Compress first
  const compressed = await compressImage(fileOrDataUrl, 1400, 1400, 0.84);

  // 2. Cloudinary check
  try {
    const cloudName = (localStorage.getItem('verdanta_cloudinary_cloud_name') || '').trim();
    const uploadPreset = (localStorage.getItem('verdanta_cloudinary_upload_preset') || '').trim();
    if (cloudName && uploadPreset) {
      const formData = new FormData();
      formData.append('file', compressed);
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
    }
  } catch (e) {}

  // 3. Server API upload check
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: compressed })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (e) {}

  // 4. Return compressed data URL as safe local fallback
  return compressed;
}
