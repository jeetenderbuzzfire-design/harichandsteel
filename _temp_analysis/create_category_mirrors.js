const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const productHtml = fs.readFileSync(path.join(rootDir, 'product.html'), 'utf8');

const categories = [
  { slug: 'aluminum-profile-gate', label: 'Aluminum Profile Gate', desc: 'Browse our premium collection of rust-proof aluminium profile entrance gates.' },
  { slug: 'iron-main-gate', label: 'Iron Main Gate', desc: 'Browse our heavy-duty wrought iron entrance gates engineered for durability and classic architecture.' },
  { slug: 'steel-main-gate', label: 'Steel Main Gate', desc: 'Browse genuine SS304 grade stainless steel main gates with CNC laser-cut designs.' },
  { slug: 'steel-door', label: 'Steel Door', desc: 'Browse high-security steel doors and entrance security partitions engineered for safety.' },
  { slug: 'powder-coated-gates', label: 'Powder Coated Gates', desc: 'Browse custom powder-coated entrance gates with corrosion-resistant finishes.' }
];

categories.forEach(cat => {
  const dir = path.join(rootDir, 'product-category', cat.slug);
  fs.mkdirSync(dir, { recursive: true });

  let pageHtml = productHtml;

  // 1. Update Title and Canonical
  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${cat.label} - HARICHAND STEEL</title>`
  );
  pageHtml = pageHtml.replace(
    /<link rel="canonical" href="[^"]*">/i,
    `<link rel="canonical" href="https://harichandsteel.com/product-category/${cat.slug}/">`
  );

  // 2. Update Meta Description
  pageHtml = pageHtml.replace(
    /<meta name="description"\s+content="[^"]*">/i,
    `<meta name="description" content="${cat.desc}">`
  );

  // 3. Update Breadcrumb in HTML
  const breadcrumbSearch = /<div class="breadcrumb-nav"[^>]*>[\s\S]*?<\/div>/i;
  const newBreadcrumbs = `<div class="breadcrumb-nav" id="catalogueBreadcrumbs" aria-label="Breadcrumbs">
        <a href="index.html">Home</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="product.html">Product</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <span>${cat.label}</span>
      </div>`;
  if (breadcrumbSearch.test(pageHtml)) {
    pageHtml = pageHtml.replace(breadcrumbSearch, newBreadcrumbs);
  }

  // 4. Update Filter Active Buttons
  // Remove active from "all"
  pageHtml = pageHtml.replace(/<button class="filter-btn active" data-filter="all">/g, '<button class="filter-btn" data-filter="all">');
  // Add active to cat.slug
  pageHtml = pageHtml.replace(
    new RegExp(`<button class="filter-btn" data-filter="${cat.slug}">`, 'g'),
    `<button class="filter-btn active" data-filter="${cat.slug}">`
  );

  // 5. Update Product Cards Visibility in static markup
  // All cards not in this category will start hidden in HTML before JS runs
  const cardRegex = /<article class="product-card" data-category="([^"]+)">/g;
  pageHtml = pageHtml.replace(cardRegex, (match, cardCat) => {
    if (cardCat === cat.slug) {
      return `<article class="product-card" data-category="${cardCat}" style="display: flex;">`;
    } else {
      return `<article class="product-card" data-category="${cardCat}" style="display: none;">`;
    }
  });

  const destPath = path.join(dir, 'index.html');
  fs.writeFileSync(destPath, pageHtml, 'utf8');
  console.log(`Created category mirror: product-category/${cat.slug}/index.html`);
});

console.log('All product category mirrors created successfully!');
