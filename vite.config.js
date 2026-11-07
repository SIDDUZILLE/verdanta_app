import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * Dev API middleware for full local persistence during `npm run dev`.
 * Automatically saves products, categories, hero banner, corporate cards,
 * config, proposals, orders, and uploaded images to disk.
 */
function viteDevApiPlugin() {
  const baseDir = __dirname;
  const publicDir = path.resolve(baseDir, 'public');
  const uploadsProductsDir = path.resolve(publicDir, 'uploads', 'products');
  const rootUploadsProductsDir = path.resolve(baseDir, 'uploads', 'products');

  // Ensure upload directories exist
  [uploadsProductsDir, rootUploadsProductsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const fileMap = {
    '/api/products': 'products.json',
    '/api/categories': 'categories.json',
    '/api/hero': 'hero.json',
    '/api/corporate-cards': 'corporate_cards.json',
    '/api/config': 'config.json',
    '/api/proposals': 'proposals.json',
    '/api/enquiries': 'proposals.json',
    '/api/orders': 'orders.json'
  };

  const getTimestamps = () => {
    const timestamps = {};
    for (const [route, fileName] of Object.entries(fileMap)) {
      const pubPath = path.resolve(publicDir, fileName);
      const rootPath = path.resolve(baseDir, fileName);
      let mtime = 0;
      if (fs.existsSync(pubPath)) {
        mtime = fs.statSync(pubPath).mtimeMs;
      } else if (fs.existsSync(rootPath)) {
        mtime = fs.statSync(rootPath).mtimeMs;
      }
      const key = fileName.replace('.json', '');
      timestamps[key] = mtime;
    }
    return timestamps;
  };

  return {
    name: 'vite-dev-api-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (!url.startsWith('/api/')) {
          return next();
        }

        // Common CORS & Cache Headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        // 1. Sync Status heartbeat
        if (url === '/api/sync-status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.statusCode = 200;
          return res.end(JSON.stringify({ status: 'online', timestamps: getTimestamps() }));
        }

        // 2. Base64 Image Upload
        if (url === '/api/upload-image' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const imgData = data.image || '';
              if (!imgData || !imgData.startsWith('data:image')) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'No image data provided' }));
              }

              const [header, base64Data] = imgData.split(',', 2);
              let ext = 'jpg';
              if (header.includes('png')) ext = 'png';
              else if (header.includes('webp')) ext = 'webp';

              const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
              const buf = Buffer.from(base64Data, 'base64');

              // Write to both public and root uploads
              fs.writeFileSync(path.join(uploadsProductsDir, filename), buf);
              fs.writeFileSync(path.join(rootUploadsProductsDir, filename), buf);

              const webPath = `/uploads/products/${filename}`;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, url: webPath }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // 3. Handlers for products, categories, hero, corporate cards, config, proposals, orders
        const targetFileName = fileMap[url];
        if (targetFileName) {
          const pubFile = path.resolve(publicDir, targetFileName);
          const rootFile = path.resolve(baseDir, targetFileName);

          if (req.method === 'GET') {
            const filePath = fs.existsSync(pubFile) ? pubFile : (fs.existsSync(rootFile) ? rootFile : null);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            if (filePath && fs.existsSync(filePath)) {
              res.statusCode = 200;
              return res.end(fs.readFileSync(filePath, 'utf8'));
            } else {
              res.statusCode = 200;
              return res.end(targetFileName.includes('hero') || targetFileName.includes('config') ? '{}' : '[]');
            }
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const formatted = JSON.stringify(parsed, null, 2);

                // Write to both public/ and root directory
                fs.writeFileSync(pubFile, formatted, 'utf8');
                fs.writeFileSync(rootFile, formatted, 'utf8');

                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, saved: true, timestamp: Date.now() }));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
        }

        // Unknown API route
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteDevApiPlugin(),
    {
      name: 'generate-admin-routes',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          // Copy to dist/admin.html so /admin.html works on static servers
          fs.copyFileSync(indexPath, path.join(distDir, 'admin.html'));

          // Copy to dist/admin/index.html so /admin works even if server doesn't rewrite
          const adminDir = path.join(distDir, 'admin');
          if (!fs.existsSync(adminDir)) {
            fs.mkdirSync(adminDir, { recursive: true });
          }
          fs.copyFileSync(indexPath, path.join(adminDir, 'index.html'));
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false
  }
});
