# 🌿 Verdanta World — Artisanal Indian Décor & Corporate Gifting

Verdanta World is a luxury e-commerce storefront and comprehensive administrative management portal celebrating handcrafted Indian décor, artisanal heirlooms, corporate ESG gift collections, and international wholesale export.

---

## 🌟 Key Features

- **Customer Storefront (`index.html`)**:
  - Hero banner with customizable imagery and messaging.
  - 4 Shop Collections (Artisan Gallery, Wooden Crafts, Premium Home Décor, Gifting).
  - Corporate Gifting B2B channel with 6 dedicated sub-categories.
  - Wholesale and Global Export portfolios.
  - Interactive Shopping Bag, instant WhatsApp ordering integration.
  - Filter by category, sub-category, price, and real-time instant search.
  - Interactive proposals and appointment booking modal.

- **Admin Management Portal (`admin.html`)**:
  - Full CRUD for products, categories, corporate cards, and hero messaging.
  - Image upload with automatic fallback (Local Server Disk Storage or Cloudinary CDN).
  - Real-time synchronization between Storefront and Admin via BroadcastChannel.
  - Proposal request and customer lead management with status tracking.
  - Configurable WhatsApp enquiry recipient, MongoDB connection, and credentials.

- **Multi-Backend Architecture**:
  - **Python (`serve.py`)**: Dual-port local server (`3000` for storefront, `3001` for admin) with REST API, image base64 handling, and MongoDB sync.
  - **PHP (`api.php`)**: For traditional cPanel / Hostinger Apache hosting with `.htaccess` rewrite rules.
  - **Static / Serverless**: Compatible with Vercel (`vercel.json`) and Netlify (`_redirects`).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.8+ or Node.js 18+

### Running the App
```bash
# Clone the repository
git clone https://github.com/SIDDUZILLE/verdanta_app.git
cd verdanta_app

# Start the local server
python serve.py
# or using npm
npm start
```

- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3001](http://localhost:3001) or [http://localhost:3000/admin](http://localhost:3000/admin)

### Build & Integrity Check
```bash
npm run build
# or
node build.js
```

---

## 🌐 Deployment Options

### 1. Vercel
- Configured via `vercel.json`.
- Automatic clean URLs and `/admin` rewrite to `admin.html`.
- Push to GitHub and import the repository into your Vercel Dashboard.

### 2. Netlify / Cloudflare Pages
- Routing configured via `_redirects`.
- Publish directory: `./` (root).

### 3. Hostinger / Apache cPanel
- Upload all files into `public_html`.
- `.htaccess` handles `/admin` and `/api/*` routing to `api.php`.
- Ensure `uploads/products` has write permissions (`0755` or `0777`).

---

## 📁 Project Structure

```
├── index.html              # Main customer storefront
├── style.css               # Luxury storefront design system
├── app.js                  # Storefront interactivity, cart, search & filters
├── admin.html              # Admin dashboard & product management portal
├── admin.css               # Admin control panel styling
├── admin.js                # Admin CRUD logic & image uploader
├── serve.py                # Python REST API server (ports 3000 & 3001)
├── api.php                 # PHP REST API for Apache / Hostinger
├── .htaccess               # Apache routing rules
├── vercel.json             # Vercel deployment configuration
├── _redirects              # Netlify / Cloudflare Pages routing
├── package.json            # Node scripts & deployment commands
├── build.js                # Production validation & integrity runner
├── products.json           # Catalog dataset
├── categories.json         # Taxonomy & collections dataset
├── corporate_cards.json    # Corporate cards dataset
├── hero.json               # Dynamic hero banner settings
├── proposals.json          # Leads & proposal submissions
├── config.json             # Server & admin credentials configuration
└── images/                 # Brand imagery and collection banners
```

---

## 🔒 Default Admin Credentials

- **Username**: `admin`
- **Password**: `Verdanta@Admin2026`
*(Can be updated in `config.json` or through Admin Settings)*
