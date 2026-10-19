import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
