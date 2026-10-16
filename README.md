# 🌿 Verdanta World — Artisanal Indian Décor & Corporate Gifting (React)

Verdanta World is a luxury e-commerce storefront and comprehensive administrative management portal celebrating handcrafted Indian décor, artisanal heirlooms, corporate ESG gift collections, and international wholesale export. Built with **React 18**, **Vite**, and **React Router**.

---

## 🌟 Key Features

- **Customer Storefront (`/`)**:
  - Hero banner with customizable imagery and live CMS messaging.
  - 4 Shop Collections (Artisan Gallery, Wooden Crafts, Premium Home Décor, Gifting) across 141 authentic products.
  - Corporate Gifting B2B channel with 6 dedicated sub-categories.
  - Wholesale and Global Export showcases with Lookbook download.
  - Interactive Shopping Bag (Slide-out drawer, live subtotal, ₹2,499 free-shipping threshold counter, quantity controls).
  - One-click WhatsApp Order Checkout with preformatted itemized message.
  - Interactive Quick View modal, Corporate Proposal request modal, and Atelier studio visit booking modal.
  - Live instant typeahead search overlay with category filters.

- **Admin Management Portal (`/admin`)**:
  - Secure master authentication gate (`admin` / `Verdanta@Admin2026`).
  - Full CRUD for products, categories, corporate cards, and hero messaging.
  - Photo uploader with automatic fallback (Local server storage or Cloudinary CDN).
  - Real-time cross-tab synchronization between Storefront and Admin via `BroadcastChannel`.
  - Proposals & inquiries lead tracker with status updater and one-click WhatsApp client contact.
  - Configurable WhatsApp recipient phone number, admin credentials, and MongoDB connection.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (tested on Node 20+)

### Running the App
```bash
# Clone the repository
git clone https://github.com/SIDDUZILLE/verdanta_app.git
cd verdanta_app

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)

### Build for Production
```bash
npm run build
```
Generates an optimized production bundle in the `dist/` directory.

---

## 🌐 Deployment Options

### 1. Vercel
- Configured via `vercel.json` for React Single Page Application (SPA) routing.
- Simply import your repository into Vercel and it will automatically detect Vite.

### 2. Netlify / Cloudflare Pages
- Routing configured via `public/_redirects` (`/* /index.html 200`).
- Build command: `npm run build`
- Publish directory: `dist`

### 3. Hostinger / Apache cPanel
- Upload the contents of the `dist/` directory into `public_html`.
- `.htaccess` handles routing to `index.html`.

---

## 📁 Architecture & Directory Structure

```
├── index.html                   # Vite HTML entry point with fonts & meta
├── vite.config.js               # Vite build configuration (React plugin)
├── package.json                 # Scripts & dependencies
├── vercel.json                  # Vercel SPA routing
├── public/                      # Static assets & initial datasets
│   ├── images/                  # All 30 high-resolution artisan photos
│   ├── products.json            # 141 handcrafted creations dataset
│   ├── categories.json          # Taxonomy definitions
│   ├── hero.json                # Hero banner data
│   ├── corporate_cards.json     # 6 Corporate B2B solution cards
│   ├── proposals.json           # Inquiries data
│   ├── config.json              # System configuration
│   └── _redirects               # Netlify SPA routing rules
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application routes (/ and /admin)
    ├── styles/
    │   ├── style.css            # Luxury Storefront design system
    │   └── admin.css            # Admin Portal styling
    ├── context/
    │   ├── StoreContext.jsx     # Storefront state (Catalog, Cart, Modals, Search)
    │   └── AdminContext.jsx     # Admin state (Auth, CRUD, Proposals, Hero, Settings)
    ├── components/
    │   ├── storefront/
    │   │   ├── Navbar.jsx       # Header, navigation, bag counter, search trigger
    │   │   ├── Hero.jsx         # Dynamic hero banner with dual CTAs
    │   │   ├── CategoryPills.jsx# Channel tabs, collection cards & search bar
    │   │   ├── ProductGrid.jsx  # Responsive grid with real-time filters
    │   │   ├── ProductCard.jsx  # Individual creation card with pricing badges
    │   │   ├── CorporateSection.jsx # 6 Corporate gifting reference cards
    │   │   ├── WholesaleSection.jsx # Wholesale & Global Export showcases
    │   │   ├── CartDrawer.jsx   # Slide-out bag with WhatsApp checkout
    │   │   ├── QuickViewModal.jsx # Product detail zoom modal
    │   │   ├── ProposalModal.jsx  # B2B proposal request form
    │   │   ├── VisitModal.jsx   # Atelier appointment booking
    │   │   ├── SearchOverlay.jsx# Live search modal with typeahead
    │   │   └── Footer.jsx       # Luxury footer & concierge contact details
    │   └── admin/
    │       ├── AdminLogin.jsx   # Admin authentication gate
    │       ├── ProductList.jsx  # Products table with search & filters
    │       ├── ProductModal.jsx # Add/Edit product with photo uploader
    │       ├── HeroManager.jsx  # Dynamic hero banner live editor
    │       ├── CorporateCardsManager.jsx # Corporate B2B card editor
    │       ├── ProposalsManager.jsx # Customer leads & inquiry dossier
    │       └── SettingsManager.jsx # Credentials & WhatsApp configuration
    └── utils/
        ├── formatters.js        # Currency (₹), date, and string helpers
        └── whatsapp.js          # WhatsApp order & inquiry message generators
```

---

## 🔒 Default Admin Credentials

- **Username**: `admin`
- **Password**: `Verdanta@Admin2026`
*(Can be changed in Admin -> Store Settings)*
