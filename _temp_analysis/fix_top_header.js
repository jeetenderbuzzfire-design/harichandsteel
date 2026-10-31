const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Fix product-detail.html topbar markup
const prodDetailPath = path.join(rootDir, 'product-detail.html');
let prodDetailHtml = fs.readFileSync(prodDetailPath, 'utf8');

const standardTopbar = `  <!-- ========================================================================
       TOP BAR
       ======================================================================== -->
  <div class="topbar" id="topNotificationBar">
    <div class="container">
      <div class="topbar-left">
        <span class="badge-est"><i class="fas fa-shield-alt"></i> ESTABLISHED 2004</span>
        <div class="topbar-item">
          <i class="fas fa-map-marker-alt"></i>
          <a href="https://share.google/zrv3GklB8WzuMdZG3" target="_blank" rel="noopener">Uttam Nagar, New Delhi,
            110059</a>
        </div>
        <div class="topbar-item">
          <i class="fas fa-envelope"></i>
          <a href="mailto:Admin@HARICHANDSTEEL.COM">Admin@HARICHANDSTEEL.COM</a>
        </div>
      </div>
      <div class="topbar-right">
        <div class="topbar-item">
          <i class="fas fa-phone-alt"></i>
          <a href="tel:+919870433868">+91 98704 33868</a>
        </div>
        <div class="topbar-socials">
          <a href="https://www.facebook.com/HARICHAND.STEEL/" target="_blank" rel="noopener" aria-label="Facebook"><i
              class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/harichand_steel_official/?hl=en" target="_blank" rel="noopener"
            aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.youtube.com/channel/UC7qdT0UJ9YB1GrXkZ9wwUlA" target="_blank" rel="noopener"
            aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </div>`;

// Replace <div class="top-bar" id="topNotificationBar"> ... </div>
const oldTopbarRegex = /<!-- =+\s*TOP NOTIFICATION BAR\s*=+\s*-->\s*<div class="top-bar" id="topNotificationBar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i;

if (oldTopbarRegex.test(prodDetailHtml)) {
  prodDetailHtml = prodDetailHtml.replace(oldTopbarRegex, standardTopbar);
  fs.writeFileSync(prodDetailPath, prodDetailHtml, 'utf8');
  console.log('Successfully updated product-detail.html with standard topbar markup!');
} else {
  console.log('Could not find old topbar block in product-detail.html');
}

// 2. Update css/style.css with robust support for both .topbar and .top-bar
const cssPath = path.join(rootDir, 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace .topbar definition to also include .top-bar
const targetCss = `.topbar {
  background: #090c10;
  color: #cbd5e1;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 102;
}`;

const enhancedCss = `.topbar,
.top-bar {
  background: #090c10;
  color: #cbd5e1;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 102;
}

.topbar .container,
.top-bar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
}

.top-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.topbar-left,
.top-bar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar-right,
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-pill,
.contact-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-weight: 500;
  font-size: 0.85rem;
}

.info-pill i,
.contact-pill i {
  color: var(--color-primary-light);
}

.contact-pill:hover {
  color: #ffffff;
}

.top-bar-content .divider {
  color: rgba(255, 255, 255, 0.2);
  margin: 0 4px;
}`;

if (css.includes(targetCss)) {
  css = css.replace(targetCss, enhancedCss);
  console.log('Added .top-bar selectors and pill styling to css/style.css');
} else if (!css.includes('.top-bar {')) {
  // Try regex match in case of whitespace/newlines
  css = css.replace(
    /\.topbar\s*\{[\s\S]*?z-index:\s*102;\s*\}/,
    enhancedCss
  );
  console.log('Regex replaced .topbar in css/style.css');
}

// Also ensure @media (max-width: 960px) hides .top-bar too
css = css.replace(
  /\.topbar\s*\{\s*display:\s*none\s*!important;\s*\}/g,
  `.topbar,\n  .top-bar {\n    display: none !important;\n  }`
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated css/style.css!');
