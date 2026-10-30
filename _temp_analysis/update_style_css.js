const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Add base .cat-tile-detail classes after .cat-tile span { ... }
const baseTarget = `.cat-tile span {
  font-size: 0.78rem;
  color: var(--color-primary);
  font-weight: 600;
}`;

const baseAddition = `

/* Detailed Product Category Cards (e.g. on our-products.html) */
.cat-tile-detail {
  padding: 32px 24px;
  text-align: left;
  align-items: flex-start;
  scroll-margin-top: 100px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cat-tile-detail .cat-icon {
  margin-bottom: 12px;
  flex-shrink: 0;
}

.cat-tile-title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
  line-height: 1.3;
}

.cat-tile-desc {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 20px;
  flex-grow: 1;
}

.cat-tile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
  width: 100%;
}

.cat-tile-actions .btn {
  flex: 1 1 auto;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
}

.cat-tile[id],
section[id],
.product-card[id] {
  scroll-margin-top: 100px;
}`;

if (!css.includes('.cat-tile-detail')) {
  css = css.replace(baseTarget, baseTarget + baseAddition);
  console.log('Added base .cat-tile-detail styles');
} else {
  console.log('.cat-tile-detail already present in base');
}

// 2. Add 1024px responsive styles
const target1024 = `@media (max-width: 1024px) {
  .category-cards-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 16px !important;
  }`;

const add1024 = `@media (max-width: 1024px) {
  .category-cards-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 16px !important;
  }

  .cat-tile-detail {
    padding: 24px 20px !important;
  }

  .cat-tile-title {
    font-size: 1.25rem !important;
  }`;

if (css.includes(target1024) && !css.includes('.cat-tile-detail {') && !css.includes('padding: 24px 20px !important;')) {
  css = css.replace(target1024, add1024);
  console.log('Added 1024px responsive styles');
}

// 3. Add 768px responsive styles
const target768 = `  /* Category Showcase Grid */
  .category-cards-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
  }

  .cat-tile {
    padding: 16px 10px !important;
  }`;

const add768 = `  /* Category Showcase Grid */
  .category-cards-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
  }

  .cat-tile {
    padding: 16px 10px !important;
  }

  .cat-tile-detail {
    padding: 20px 16px !important;
  }

  .cat-tile-title {
    font-size: 1.18rem !important;
  }

  .cat-tile-desc {
    font-size: 0.9rem !important;
    line-height: 1.6 !important;
    margin-bottom: 16px !important;
  }

  .cat-tile-actions {
    gap: 8px !important;
  }

  .cat-tile-actions .btn {
    padding: 9px 10px !important;
    font-size: 0.85rem !important;
  }`;

if (css.includes(target768) && !css.includes('font-size: 1.18rem !important;')) {
  css = css.replace(target768, add768);
  console.log('Added 768px responsive styles');
}

// 4. Add 480px responsive styles
const target480 = `  /* Category Cards Single Column on Narrow Mobile */
  .category-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }`;

const add480 = `  /* Category Cards Single Column on Narrow Mobile */
  .category-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  .cat-tile-detail {
    padding: 16px 12px !important;
  }

  .cat-tile-actions {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
  }

  .cat-tile-actions .btn {
    flex: 1 1 calc(50% - 4px) !important;
    min-width: 110px !important;
    padding: 9px 6px !important;
    font-size: 0.8rem !important;
  }`;

if (css.includes(target480) && !css.includes('flex: 1 1 calc(50% - 4px) !important;')) {
  css = css.replace(target480, add480);
  console.log('Added 480px responsive styles');
}

// 5. Add 360px responsive styles
const target360 = `  .product-card-ctas .btn {
    width: 100% !important;
  }`;

const add360 = `  .product-card-ctas .btn {
    width: 100% !important;
  }

  .cat-tile-actions {
    flex-direction: column !important;
    gap: 8px !important;
  }

  .cat-tile-actions .btn {
    width: 100% !important;
    flex: 1 1 100% !important;
    padding: 10px 12px !important;
    font-size: 0.84rem !important;
  }`;

if (css.includes(target360) && !css.includes('.cat-tile-actions {') && !css.includes('flex-direction: column !important;')) {
  css = css.replace(target360, add360);
  console.log('Added 360px responsive styles');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Updated style.css successfully!');
