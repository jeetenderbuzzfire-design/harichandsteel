const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update product.html
const productHtmlPath = path.join(rootDir, 'product.html');
let productHtml = fs.readFileSync(productHtmlPath, 'utf8');

// Ensure IDs on title and lead
productHtml = productHtml.replace(
  /<h1 class="page-title">Gate Products Catalogue<\/h1>/i,
  '<h1 class="page-title" id="cataloguePageTitle">Gate Products Catalogue</h1>'
);
productHtml = productHtml.replace(
  /<p class="page-lead">Explore premium handcrafted gate models built for luxury, safety, and longevity\.<\/p>/i,
  '<p class="page-lead" id="cataloguePageLead">Explore premium handcrafted gate models built for luxury, safety, and longevity.</p>'
);

// Update button label for steel doors to plural "Steel Doors"
productHtml = productHtml.replace(
  /<button class="filter-btn" data-filter="steel-door" data-label="Steel Door">Steel Door<\/button>/i,
  '<button class="filter-btn" data-filter="steel-door" data-label="Steel Doors">Steel Doors</button>'
);

fs.writeFileSync(productHtmlPath, productHtml, 'utf8');
console.log('✓ product.html updated successfully.');

// 2. Update js/main.js
const mainJsPath = path.join(rootDir, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Replace getCategoryLabel and renderBreadcrumbs with enhanced category metadata and updateBannerHeader
const oldCategoryLabelSection = `    // Helper: get display label for category
    function getCategoryLabel(filterKey) {
      if (!filterKey || filterKey === 'all') return 'All Products';
      const btn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterKey);
      if (btn) {
        return btn.getAttribute('data-label') || btn.textContent.replace(/\\s*\\(\\d+\\)\\s*$/, '').trim();
      }
      return filterKey.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    }

    // 3. Render Breadcrumbs
    function renderBreadcrumbs(page) {
      if (!breadcrumbNav) return;
      const isFiltered = currentFilter && currentFilter !== 'all';
      const categoryLabel = getCategoryLabel(currentFilter);

      if (isFiltered) {
        if (page > 1) {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="product.html">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="/product-category/\${currentFilter}/">\${categoryLabel}</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Page \${page}</span>
          \`;
          document.title = \`\${categoryLabel} - Page \${page} - HARICHAND STEEL\`;
        } else {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="product.html">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>\${categoryLabel}</span>
          \`;
          document.title = \`\${categoryLabel} - HARICHAND STEEL\`;
        }
      } else {
        if (page > 1) {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="product.html">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Page \${page}</span>
          \`;
          document.title = \`Product - Page \${page} - HARICHAND STEEL\`;
        } else {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Product</span>
          \`;
          document.title = 'Product - HARICHAND STEEL';
        }
      }
    }`;

const newCategoryLabelSection = `    // Category Metadata Dictionary for dynamic heading, lead text, breadcrumb, and titles
    const CATEGORY_META = {
      'all': {
        title: 'Gate Products Catalogue',
        lead: 'Explore premium handcrafted gate models built for luxury, safety, and longevity.',
        breadcrumb: 'Product',
        docTitle: 'Gate Products Catalogue - HARICHAND STEEL'
      },
      'steel-door': {
        title: 'Steel Doors',
        lead: 'Heavy-duty security doors designed for main entrances, back doors, and security partitions with multi-point locking systems and weatherproofing.',
        breadcrumb: 'Steel Doors',
        docTitle: 'Steel Doors - HARICHAND STEEL'
      },
      'aluminum-profile-gate': {
        title: 'Aluminum Profile Gates',
        lead: 'Engineered with lightweight yet rigid aluminium extrusions, offering modern luxury styling, rust-proof longevity, and effortless automation capability.',
        breadcrumb: 'Aluminum Profile Gate',
        docTitle: 'Aluminum Profile Gates - HARICHAND STEEL'
      },
      'iron-main-gate': {
        title: 'Iron Main Gates',
        lead: 'Heavy-duty wrought iron main entrance gates crafted with traditional forged strength, security spikes, and timeless aesthetic designs.',
        breadcrumb: 'Iron Main Gate',
        docTitle: 'Iron Main Gates - HARICHAND STEEL'
      },
      'steel-main-gate': {
        title: 'Steel Main Gates',
        lead: 'Fabricated from genuine SS304 grade stainless steel and heavy-gauge mild steel featuring intricate CNC laser-cut designs with polished mirror or matte finishes.',
        breadcrumb: 'Steel Main Gate',
        docTitle: 'Steel Main Gates - HARICHAND STEEL'
      },
      'powder-coated-gates': {
        title: 'Powder Coated Gates',
        lead: 'Superior rust-resistant powder-coated gate systems offering vibrant long-lasting exterior colors, UV protection, and minimal maintenance.',
        breadcrumb: 'Powder Coated Gates',
        docTitle: 'Powder Coated Gates - HARICHAND STEEL'
      }
    };

    // Helper: get display label for category
    function getCategoryLabel(filterKey) {
      if (!filterKey || filterKey === 'all') return 'All Gates';
      const btn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterKey);
      if (btn) {
        return btn.getAttribute('data-label') || btn.textContent.replace(/\\s*\\(\\d+\\)\\s*$/, '').trim();
      }
      return filterKey.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    }

    // Helper: get full metadata for category
    function getCategoryMeta(filterKey) {
      if (!filterKey || filterKey === 'all') return CATEGORY_META['all'];
      if (CATEGORY_META[filterKey]) return CATEGORY_META[filterKey];
      const fallbackLabel = getCategoryLabel(filterKey);
      return {
        title: fallbackLabel,
        lead: \`Explore our premium handcrafted \${fallbackLabel.toLowerCase()} collection built for luxury, safety, and longevity.\`,
        breadcrumb: fallbackLabel,
        docTitle: \`\${fallbackLabel} - HARICHAND STEEL\`
      };
    }

    // Helper: update page banner header and subtitle dynamically
    function updateBannerHeader(page) {
      const bannerTitle = document.getElementById('cataloguePageTitle') || document.querySelector('.page-header-banner .page-title');
      const bannerLead = document.getElementById('cataloguePageLead') || document.querySelector('.page-header-banner .page-lead');
      const meta = getCategoryMeta(currentFilter);

      if (bannerTitle) {
        const fullTitle = meta.title + (page > 1 ? \` (Page \${page})\` : '');
        if (bannerTitle.textContent !== fullTitle) {
          bannerTitle.textContent = fullTitle;
        }
      }
      if (bannerLead) {
        if (bannerLead.textContent !== meta.lead) {
          bannerLead.textContent = meta.lead;
        }
      }
    }

    // 3. Render Breadcrumbs & Title
    function renderBreadcrumbs(page) {
      if (!breadcrumbNav) return;
      const isFiltered = currentFilter && currentFilter !== 'all';
      const meta = getCategoryMeta(currentFilter);
      const breadcrumbLabel = meta.breadcrumb || getCategoryLabel(currentFilter);

      if (isFiltered) {
        if (page > 1) {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="/product">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="/product-category/\${currentFilter}/">\${breadcrumbLabel}</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Page \${page}</span>
          \`;
          document.title = \`\${meta.title} - Page \${page} - HARICHAND STEEL\`;
        } else {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="/product">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>\${breadcrumbLabel}</span>
          \`;
          document.title = \`\${meta.title} - HARICHAND STEEL\`;
        }
      } else {
        if (page > 1) {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="/product">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Page \${page}</span>
          \`;
          document.title = \`Product - Page \${page} - HARICHAND STEEL\`;
        } else {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Product</span>
          \`;
          document.title = 'Gate Products Catalogue - HARICHAND STEEL';
        }
      }
    }`;

// Normalize newlines before replace
const normalizedMainJs = mainJs.replace(/\r\n/g, '\n');
const normalizedTarget = oldCategoryLabelSection.replace(/\r\n/g, '\n');

if (normalizedMainJs.includes(normalizedTarget)) {
  const updatedMainJs = normalizedMainJs.replace(normalizedTarget, newCategoryLabelSection.replace(/\r\n/g, '\n'));
  
  // Also ensure updateBannerHeader(currentPage) is called inside applyDisplay
  let finalMainJs = updatedMainJs;
  if (!finalMainJs.includes('updateBannerHeader(currentPage);')) {
    finalMainJs = finalMainJs.replace(
      '// Update Breadcrumbs\n        renderBreadcrumbs(currentPage);',
      '// Update Banner Heading & Description\n        updateBannerHeader(currentPage);\n\n        // Update Breadcrumbs\n        renderBreadcrumbs(currentPage);'
    );
  }

  // Also in non-paginated view:
  if (!finalMainJs.includes('updateBannerHeader(1);')) {
    finalMainJs = finalMainJs.replace(
      'countSummary.innerHTML = `Showing <strong>${visibleCount}</strong> of <strong>${cards.length}</strong> results in <em>${activeLabel}</em>`;\n          }\n        }',
      'countSummary.innerHTML = `Showing <strong>${visibleCount}</strong> of <strong>${cards.length}</strong> results in <em>${activeLabel}</em>`;\n          }\n        }\n        updateBannerHeader(1);'
    );
  }

  fs.writeFileSync(mainJsPath, finalMainJs.replace(/\n/g, '\r\n'), 'utf8');
  console.log('✓ js/main.js updated successfully.');
} else {
  console.error('Target not found in js/main.js!');
  process.exit(1);
}

// 3. Update server.js
const serverJsPath = path.join(rootDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8');
const normalizedServerJs = serverJs.replace(/\r\n/g, '\n');

const oldServerRoute = `  // --- B1. Product Category Catalogue: /product-category/:category/ and /product-category/:category/page/:num/ ---
  const categoryMatch = pathname.match(/^\\/product-category\\/([a-zA-Z0-9_-]+)(?:\\/page\\/(\\d+))?\\/?$/i);
  if (categoryMatch) {
    const productHtmlPath = path.join(ROOT_DIR, 'product.html');
    if (fs.existsSync(productHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(productHtmlPath).pipe(res);
      return;
    }
  }`;

const newServerRoute = `  // --- B1. Product Category Catalogue: /product-category/:category/ and /product-category/:category/page/:num/ ---
  const categoryMatch = pathname.match(/^\\/product-category\\/([a-zA-Z0-9_-]+)(?:\\/page\\/(\\d+))?\\/?$/i);
  if (categoryMatch) {
    const category = categoryMatch[1].toLowerCase();
    const pageNum = categoryMatch[2] ? parseInt(categoryMatch[2], 10) : 1;
    const productHtmlPath = path.join(ROOT_DIR, 'product.html');
    if (fs.existsSync(productHtmlPath)) {
      try {
        let html = fs.readFileSync(productHtmlPath, 'utf8');

        const metaMap = {
          'steel-door': {
            title: 'Steel Doors',
            lead: 'Heavy-duty security doors designed for main entrances, back doors, and security partitions with multi-point locking systems and weatherproofing.',
            breadcrumb: 'Steel Doors',
            docTitle: 'Steel Doors - HARICHAND STEEL'
          },
          'aluminum-profile-gate': {
            title: 'Aluminum Profile Gates',
            lead: 'Engineered with lightweight yet rigid aluminium extrusions, offering modern luxury styling, rust-proof longevity, and effortless automation capability.',
            breadcrumb: 'Aluminum Profile Gate',
            docTitle: 'Aluminum Profile Gates - HARICHAND STEEL'
          },
          'iron-main-gate': {
            title: 'Iron Main Gates',
            lead: 'Heavy-duty wrought iron main entrance gates crafted with traditional forged strength, security spikes, and timeless aesthetic designs.',
            breadcrumb: 'Iron Main Gate',
            docTitle: 'Iron Main Gates - HARICHAND STEEL'
          },
          'steel-main-gate': {
            title: 'Steel Main Gates',
            lead: 'Fabricated from genuine SS304 grade stainless steel and heavy-gauge mild steel featuring intricate CNC laser-cut designs with polished mirror or matte finishes.',
            breadcrumb: 'Steel Main Gate',
            docTitle: 'Steel Main Gates - HARICHAND STEEL'
          },
          'powder-coated-gates': {
            title: 'Powder Coated Gates',
            lead: 'Superior rust-resistant powder-coated gate systems offering vibrant long-lasting exterior colors, UV protection, and minimal maintenance.',
            breadcrumb: 'Powder Coated Gates',
            docTitle: 'Powder Coated Gates - HARICHAND STEEL'
          }
        };

        const meta = metaMap[category] || {
          title: category.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
          lead: \`Explore our premium handcrafted \${category.replace(/-/g, ' ')} models built for luxury, safety, and longevity.\`,
          breadcrumb: category.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
          docTitle: \`\${category.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())} - HARICHAND STEEL\`
        };

        const fullTitle = pageNum > 1 ? \`\${meta.title} (Page \${pageNum})\` : meta.title;
        const fullDocTitle = pageNum > 1 ? \`\${meta.title} - Page \${pageNum} - HARICHAND STEEL\` : meta.docTitle;

        // Replace <title>
        html = html.replace(/<title>.*?<\\/title>/i, \`<title>\${fullDocTitle}</title>\`);

        // Replace Page Title H1
        html = html.replace(/(<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>).*?(<\\/h1>)/i, \`$1\${fullTitle}$2\`);

        // Replace Page Lead P
        html = html.replace(/(<p[^>]*class="[^"]*page-lead[^"]*"[^>]*>).*?(<\\/p>)/i, \`$1\${meta.lead}$2\`);

        // Pre-render breadcrumb navigation
        const breadcrumbHtml = pageNum > 1 ? \`
        <a href="index.html">Home</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="/product">Product</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="/product-category/\${category}/">\${meta.breadcrumb}</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <span>Page \${pageNum}</span>
      \` : \`
        <a href="index.html">Home</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="/product">Product</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <span>\${meta.breadcrumb}</span>
      \`;
        html = html.replace(/(<nav[^>]*id="catalogueBreadcrumbs"[^>]*>)([\\s\\S]*?)(<\\/nav>)/i, \`$1\${breadcrumbHtml}$3\`);

        // Switch active filter button
        html = html.replace(/(<button[^>]*class="[^"]*filter-btn)\\s+active([^"]*"[^>]*data-filter="all")/i, '$1$2');
        html = html.replace(new RegExp(\`(<button[^>]*class="[^"]*filter-btn)([^"]*"[^>]*data-filter="\${category}")\`, 'i'), '$1 active$2');

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
      } catch (err) {
        console.error('Error serving category page:', err);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(productHtmlPath).pipe(res);
        return;
      }
    }
  }`;

if (normalizedServerJs.includes(oldServerRoute.replace(/\r\n/g, '\n'))) {
  const updatedServerJs = normalizedServerJs.replace(oldServerRoute.replace(/\r\n/g, '\n'), newServerRoute.replace(/\r\n/g, '\n'));
  fs.writeFileSync(serverJsPath, updatedServerJs.replace(/\n/g, '\r\n'), 'utf8');
  console.log('✓ server.js updated successfully.');
} else {
  console.error('Target not found in server.js!');
  process.exit(1);
}

// 4. Fix accidental links with trailing hyphen in index.html and our-products.html
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/\/product-category\/aluminum-profile-gate\/-with-rose-gold-handle/g, '/product/aluminum-profile-gate-with-rose-gold-handle');
indexHtml = indexHtml.replace(/\/product-category\/aluminum-profile-gate\/-with-steel-frame/g, '/product/aluminum-profile-gate-with-steel-frame');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ index.html links fixed.');

const ourProductsPath = path.join(rootDir, 'our-products.html');
let ourProducts = fs.readFileSync(ourProductsPath, 'utf8');
ourProducts = ourProducts.replace(/\/product-category\/aluminum-profile-gate\/-with-rose-gold-handle/g, '/product/aluminum-profile-gate-with-rose-gold-handle');
ourProducts = ourProducts.replace(/\/product-category\/aluminum-profile-gate\/-with-steel-frame/g, '/product/aluminum-profile-gate-with-steel-frame');
fs.writeFileSync(ourProductsPath, ourProducts, 'utf8');
console.log('✓ our-products.html links fixed.');

console.log('ALL UPDATES COMPLETE!');
