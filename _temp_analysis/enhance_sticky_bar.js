const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const stylePath = path.join(rootDir, 'css', 'style.css');

let css = fs.readFileSync(stylePath, 'utf8');

// 1. Remove old base rule around line 1984
const oldBase = `/* Mobile Sticky Bar */
.mobile-sticky-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0f141a;
  border-top: 1px solid var(--color-border-dark);
  padding: 10px 16px;
  z-index: 1000;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.3);
}

.mobile-sticky-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}`;

const newBase = `/* ==========================================================================
   MOBILE STICKY BOTTOM BAR - ADVANCED RESPONSIVE SYSTEM
   ========================================================================== */
.mobile-sticky-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(15, 20, 26, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 10px 16px;
  padding-bottom: max(10px, env(safe-area-inset-bottom, 10px));
  z-index: 9999;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  transform: translateZ(0);
}

.mobile-sticky-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.mobile-sticky-grid .btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  min-height: 46px !important;
  padding: 10px 14px !important;
  font-family: var(--font-body, system-ui, -apple-system, sans-serif) !important;
  font-size: clamp(0.85rem, 3.8vw, 0.96rem) !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
  text-transform: uppercase !important;
  border-radius: var(--radius-sm, 6px) !important;
  text-decoration: none !important;
  white-space: nowrap !important;
  box-sizing: border-box !important;
  cursor: pointer !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease !important;
  -webkit-tap-highlight-color: transparent !important;
}

.mobile-sticky-grid .btn i {
  font-size: 1.15em !important;
  margin-right: 8px !important;
  flex-shrink: 0 !important;
}

.mobile-sticky-grid .btn:active {
  transform: scale(0.97) !important;
}

.mobile-sticky-grid .btn.btn-primary {
  background: linear-gradient(135deg, #d32f2f, #b71c1c) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  box-shadow: 0 3px 12px rgba(211, 47, 47, 0.38) !important;
}

.mobile-sticky-grid .btn.btn-whatsapp {
  background: linear-gradient(135deg, #25D366, #128C7E) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  box-shadow: 0 3px 12px rgba(37, 211, 102, 0.35) !important;
}`;

// Normalize line breaks for matching
const normalize = s => s.replace(/\r\n/g, '\n');

if (normalize(css).includes(normalize(oldBase))) {
  css = normalize(css).replace(normalize(oldBase), newBase);
  console.log('✓ Updated base .mobile-sticky-bar in style.css');
}

// 2. Remove redundant snippet at line 2241 if present
const redundantSnippet = `  .mobile-sticky-bar {
    display: block;
  }
  
  body {
    padding-bottom: 60px;
  }`;

if (normalize(css).includes(normalize(redundantSnippet))) {
  css = normalize(css).replace(normalize(redundantSnippet), '');
  console.log('✓ Cleaned redundant snippet at line 2241 in style.css');
}

// 3. Update the media queries section for mobile sticky bar
const oldMediaSnippet = `  /* 2. Persistent Clean 2-Button Bottom Bar */
  .mobile-sticky-bar {
    display: block !important;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    background: rgba(15, 20, 26, 0.98) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
    padding: 10px 16px !important;
    padding-bottom: max(10px, env(safe-area-inset-bottom)) !important;
    z-index: 1000 !important;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.5) !important;
  }

  .mobile-sticky-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
    max-width: 540px !important;
    margin: 0 auto !important;
  }

  .mobile-sticky-grid .btn {
    width: 100% !important;
    justify-content: center !important;
    padding: 12px 14px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    border-radius: var(--radius-sm, 6px) !important;
  }

  /* 3. Body Clearance for Sticky Bottom Bar */
  body {
    padding-bottom: 74px !important;
  }`;

const newMediaSnippet = `  /* 2. Persistent Clean 2-Button Bottom Bar */
  .mobile-sticky-bar {
    display: block !important;
  }

  /* 3. Body Clearance for Sticky Bottom Bar */
  body {
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
  }

  /* Coordinate Floating Icons with Sticky Bar */
  .floating-actions .floating-btn.whatsapp,
  .floating-actions .floating-btn.phone {
    display: none !important;
  }

  .floating-actions {
    bottom: calc(76px + env(safe-area-inset-bottom, 10px)) !important;
    right: 14px !important;
    z-index: 999 !important;
  }

  .floating-actions .floating-btn.scroll-top {
    width: 42px !important;
    height: 42px !important;
    font-size: 0.95rem !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4) !important;
  }`;

if (normalize(css).includes(normalize(oldMediaSnippet))) {
  css = normalize(css).replace(normalize(oldMediaSnippet), newMediaSnippet);
  console.log('✓ Updated media query snippet in style.css');
}

// 4. Append comprehensive mobile breakpoint rules to the end of style.css
const additionalResponsiveRules = `
/* ==========================================================================
   UNIVERSAL RESPONSIVE ENHANCEMENTS FOR MOBILE STICKY BAR
   ========================================================================== */

/* Tablets & Mobile (<= 960px): Enable Sticky Bar */
@media (max-width: 960px) {
  .mobile-sticky-bar {
    display: block !important;
  }

  body {
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
  }

  .floating-actions .floating-btn.whatsapp,
  .floating-actions .floating-btn.phone {
    display: none !important;
  }

  .floating-actions {
    bottom: calc(76px + env(safe-area-inset-bottom, 10px)) !important;
    right: 14px !important;
    z-index: 999 !important;
  }
}

/* Compact Smartphones (<= 480px) */
@media (max-width: 480px) {
  .mobile-sticky-bar {
    padding: 8px 12px !important;
    padding-bottom: max(8px, env(safe-area-inset-bottom, 8px)) !important;
  }

  .mobile-sticky-grid {
    gap: 10px !important;
  }

  .mobile-sticky-grid .btn {
    min-height: 44px !important;
    padding: 10px 8px !important;
    font-size: 0.88rem !important;
  }

  .mobile-sticky-grid .btn i {
    font-size: 1.1em !important;
    margin-right: 6px !important;
  }

  body {
    padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px)) !important;
  }
}

/* Extra Small Screens (<= 360px, e.g. iPhone SE, Fold outer screens) */
@media (max-width: 360px) {
  .mobile-sticky-bar {
    padding: 6px 8px !important;
    padding-bottom: max(6px, env(safe-area-inset-bottom, 6px)) !important;
  }

  .mobile-sticky-grid {
    gap: 6px !important;
  }

  .mobile-sticky-grid .btn {
    min-height: 42px !important;
    padding: 8px 4px !important;
    font-size: 0.8rem !important;
    letter-spacing: 0 !important;
  }

  .mobile-sticky-grid .btn i {
    font-size: 1em !important;
    margin-right: 4px !important;
  }

  body {
    padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px)) !important;
  }
}

/* Mobile Landscape Orientation (height <= 480px) */
@media (max-width: 960px) and (max-height: 480px) {
  .mobile-sticky-bar {
    padding: 5px 14px !important;
    padding-bottom: max(5px, env(safe-area-inset-bottom, 5px)) !important;
  }

  .mobile-sticky-grid {
    max-width: 440px !important;
  }

  .mobile-sticky-grid .btn {
    min-height: 38px !important;
    padding: 6px 10px !important;
    font-size: 0.82rem !important;
  }

  body {
    padding-bottom: calc(52px + env(safe-area-inset-bottom, 0px)) !important;
  }
}
`;

if (!css.includes('UNIVERSAL RESPONSIVE ENHANCEMENTS FOR MOBILE STICKY BAR')) {
  css += additionalResponsiveRules;
  console.log('✓ Appended universal responsive rules to style.css');
}

fs.writeFileSync(stylePath, css, 'utf8');
console.log('✓ Successfully written updated style.css');

// 5. Update viewport-fit=cover in all HTML files
function updateViewportMeta(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '_temp_analysis'].includes(entry.name)) continue;
      updateViewportMeta(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      if (html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">')) {
        html = html.replace(
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
          '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">'
        );
        fs.writeFileSync(full, html, 'utf8');
        console.log(`✓ Added viewport-fit=cover to ${path.relative(rootDir, full)}`);
      }
    }
  }
}

updateViewportMeta(rootDir);
console.log('All updates completed successfully.');
