const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Remove rigid inline grid styles from HTML files
const htmlFilesToClean = [
  'about-us.html',
  'about-us/index.html',
  'our-products.html',
  'our-products/index.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri/index.html'
];

for (const rel of htmlFilesToClean) {
  const filePath = path.join(rootDir, rel);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove inline style="grid-template-columns: repeat(5, 1fr);"
    content = content.replace(/style="grid-template-columns:\s*repeat\(5,\s*1fr\);?"/gi, '');
    // Remove inline style="grid-template-columns: repeat(4, 1fr); gap: 20px;"
    content = content.replace(/style="grid-template-columns:\s*repeat\(4,\s*1fr\);\s*gap:\s*20px;?"/gi, '');
    // Remove inline style="grid-template-columns: repeat(4, 1fr); margin: 36px 0;"
    content = content.replace(/style="grid-template-columns:\s*repeat\(4,\s*1fr\);\s*margin:\s*36px\s*0;?"/gi, 'style="margin: 36px 0;"');
    // Remove inline style="grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 50px;"
    content = content.replace(/style="grid-template-columns:\s*repeat\(3,\s*1fr\);\s*gap:\s*24px;\s*margin-bottom:\s*50px;?"/gi, 'style="margin-bottom: 50px;"');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned rigid inline grid styles from ${rel}`);
  }
}

// 2. Comprehensive Master Responsive CSS additions to css/style.css
const stylePath = path.join(rootDir, 'css', 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

const masterResponsiveCSS = `
/* ==========================================================================
   ENTERPRISE MULTI-DEVICE MASTER RESPONSIVE SUITE
   Handles Ultra-Compact (320px) -> Phablets (414px) -> Tablets (768px-1024px) -> Desktop
   ========================================================================== */

/* Universal Overflow & Layout Shield */
html, body {
  max-width: 100vw !important;
  overflow-x: hidden !important;
  position: relative;
}

*, *::before, *::after {
  box-sizing: border-box;
}

img, video, iframe, embed, object {
  max-width: 100% !important;
  height: auto;
}

/* Slider Section Container Containment */
.hero-slider-section,
.slider-container {
  overflow: hidden !important;
  max-width: 100% !important;
  width: 100% !important;
  position: relative !important;
}

/* Base Category Showcase Grid (Fluid Desktop -> Mobile) */
.category-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  width: 100%;
}

.collage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
}

/* ==========================================
   BREAKPOINT: Large Tablets & Laptops (<= 1024px)
   ========================================== */
@media (max-width: 1024px) {
  .category-cards-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 16px !important;
  }

  .collage-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 14px !important;
  }

  .strip-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px !important;
  }

  .about-grid,
  .showcase-grid {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }
}

/* ==========================================
   BREAKPOINT: Standard Tablets (<= 960px)
   ========================================== */
@media (max-width: 960px) {
  .topbar {
    display: none !important;
  }

  .mobile-menu-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 44px !important;
    height: 44px !important;
    padding: 0 !important;
    font-size: 1.25rem !important;
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
  }

  /* Nav Wrapper Safe Containment */
  .nav-wrapper {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 10px 0 !important;
    box-sizing: border-box !important;
  }

  .brand-logo {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    max-width: calc(100% - 56px) !important;
    overflow: hidden !important;
    min-width: 0 !important;
  }

  .brand-text {
    display: flex !important;
    flex-direction: column !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .brand-title {
    font-size: clamp(1.05rem, 4.4vw, 1.3rem) !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    line-height: 1.15 !important;
  }

  .brand-subtitle {
    font-size: clamp(0.58rem, 2.3vw, 0.7rem) !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    letter-spacing: 0.04em !important;
    max-width: 220px !important;
  }

  /* Mobile Drawer Navigation */
  .main-nav {
    display: none;
    position: fixed !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: rgba(15, 20, 26, 0.98) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-bottom: 2px solid var(--color-primary, #d32f2f) !important;
    flex-direction: column !important;
    padding: 18px 20px 28px !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6) !important;
    max-height: calc(100vh - 70px) !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    z-index: 10000 !important;
  }

  .main-nav.open {
    display: flex !important;
  }

  .nav-menu {
    flex-direction: column !important;
    width: 100% !important;
    gap: 6px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .nav-item {
    width: 100% !important;
  }

  .nav-link {
    display: flex !important;
    width: 100% !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 12px 14px !important;
    font-size: 0.96rem !important;
    border-radius: 6px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  }

  /* Dropdown in Mobile Drawer */
  .dropdown-menu {
    position: static !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    border: none !important;
    box-shadow: none !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border-left: 2px solid var(--color-primary, #d32f2f) !important;
    margin: 4px 0 8px 10px !important;
    padding: 6px 12px !important;
    display: none;
    border-radius: 0 6px 6px 0 !important;
  }

  .dropdown-menu.show {
    display: block !important;
  }

  .dropdown-link {
    padding: 10px 8px !important;
    font-size: 0.88rem !important;
    color: #cbd5e1 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  }

  .nav-actions {
    width: 100% !important;
    flex-direction: column !important;
    margin-top: 16px !important;
    gap: 10px !important;
  }

  .nav-actions .btn {
    width: 100% !important;
    justify-content: center !important;
    padding: 12px 16px !important;
  }

  /* Product Filters Horizontal Touch Scroll Protection */
  .product-filters {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box !important;
    justify-content: flex-start !important;
    padding: 6px 4px 14px !important;
    gap: 8px !important;
    scrollbar-width: none !important;
  }

  .product-filters::-webkit-scrollbar {
    display: none !important;
  }

  .product-filters .filter-btn {
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    padding: 8px 16px !important;
    font-size: 0.88rem !important;
  }

  /* Contact Page Grid */
  .contact-page-grid {
    grid-template-columns: 1fr !important;
    gap: 36px !important;
  }
}

/* ==========================================
   BREAKPOINT: Phablets & Mobile (<= 768px)
   ========================================== */
@media (max-width: 768px) {
  .container {
    padding: 0 16px !important;
  }

  /* Hero Typography & CTAs */
  .hero-title {
    font-size: clamp(1.75rem, 6.5vw, 2.4rem) !important;
    line-height: 1.2 !important;
  }

  .hero-lead {
    font-size: 0.98rem !important;
  }

  .hero-ctas {
    flex-direction: column !important;
    width: 100% !important;
    max-width: 380px !important;
    margin: 22px auto 0 !important;
    gap: 10px !important;
  }

  .hero-ctas .btn {
    width: 100% !important;
    justify-content: center !important;
  }

  /* Strip Cards (4-box feature strip) */
  .strip-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
    margin: 24px 0 !important;
  }

  .strip-card {
    padding: 14px 16px !important;
  }

  /* Category Showcase Grid */
  .category-cards-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
  }

  .cat-tile {
    padding: 16px 10px !important;
  }

  .collage-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
  }

  /* Product Catalog Cards */
  .product-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  .product-card {
    max-width: 480px !important;
    margin: 0 auto !important;
    width: 100% !important;
  }

  /* Article / Blog Grids */
  .news-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  /* Form & Estimator Grid */
  .estimator-form {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  .form-row {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  /* Footer 4-Column Grid */
  .footer-grid {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }

  /* Videos Grid */
  .videos-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  /* CTA Banner Flex Wrap */
  .cta-banner-buttons {
    flex-direction: column !important;
    width: 100% !important;
    gap: 10px !important;
  }

  .cta-banner-buttons .btn,
  .article-cta-box .btn,
  .article-cta-grid .btn {
    width: 100% !important;
    justify-content: center !important;
  }
}

/* ==========================================
   BREAKPOINT: Compact Smartphones (<= 480px)
   ========================================== */
@media (max-width: 480px) {
  .container {
    padding: 0 12px !important;
  }

  /* Brand Header Sizing */
  .brand-logo img {
    height: 34px !important;
  }

  .brand-title {
    font-size: 1.05rem !important;
  }

  .brand-subtitle {
    font-size: 0.6rem !important;
    max-width: 170px !important;
  }

  /* Category Cards Single Column on Narrow Mobile */
  .category-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  .collage-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  /* Large Action Buttons on Mobile */
  .btn-lg {
    padding: 12px 18px !important;
    font-size: 0.94rem !important;
    width: 100% !important;
  }

  /* Modal Safe Dimensions */
  .modal-dialog,
  .admin-modal {
    max-width: 94vw !important;
    margin: 10px auto !important;
    padding: 18px 14px !important;
  }
}

/* ==========================================
   BREAKPOINT: Ultra-Compact (<= 360px: iPhone SE1, Fold Cover)
   ========================================== */
@media (max-width: 360px) {
  .brand-logo img {
    height: 30px !important;
  }

  .brand-title {
    font-size: 0.95rem !important;
  }

  .brand-subtitle {
    display: none !important; /* Hide long subtitle on 320px screens for pure clean logo */
  }

  .hero-title {
    font-size: 1.55rem !important;
  }

  .hero-stats-row {
    grid-template-columns: 1fr !important;
  }

  .product-card-ctas {
    grid-template-columns: 1fr !important;
    gap: 6px !important;
  }

  .product-card-ctas .btn {
    width: 100% !important;
  }
}
`;

// Append Master Responsive Suite
if (!css.includes('ENTERPRISE MULTI-DEVICE MASTER RESPONSIVE SUITE')) {
  css += masterResponsiveCSS;
  fs.writeFileSync(stylePath, css, 'utf8');
  console.log('✓ Injected Master Responsive Suite into css/style.css');
} else {
  console.log('Master Responsive Suite already in css/style.css');
}

console.log('Responsive fixes successfully applied!');
