const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverJsPath = path.join(rootDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8').replace(/\r\n/g, '\n');

// Find the start of router section 4 and 5
const routerMarker = '// ==========================================\n  // 4. NESTED ASSET SERVING FOR /product/ & /admin/';
if (!serverJs.includes(routerMarker)) {
  console.error('Marker not found in server.js');
  process.exit(1);
}

const beforeRouter = serverJs.substring(0, serverJs.indexOf(routerMarker));

const newRouterAndStatic = `// ==========================================
  // 4. UNIVERSAL ASSET SERVING (HANDLES ANY PATH DEPTH)
  // ==========================================
  const isAsset = /\\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf|eot|xml)$/i.test(pathname);
  if (isAsset) {
    // 1. Direct path check from root
    let assetPath = path.join(ROOT_DIR, pathname.replace(/^\\/+/, ''));
    if (fs.existsSync(assetPath) && !fs.statSync(assetPath).isDirectory()) {
      const ext = path.extname(assetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(assetPath).pipe(res);
      return;
    }

    // 2. Nested asset extraction from sub-path (e.g. /about-us/css/style.css, /product/category/images/logo.jpeg, /admin/css/admin.css)
    const subMatch = pathname.match(/(admin\\/css\\/[^\\/]+|admin\\/js\\/[^\\/]+|css\\/[^\\/]+|js\\/[^\\/]+|images\\/[^\\/]+|webfonts\\/[^\\/]+)$/i);
    if (subMatch) {
      const nestedPath = path.join(ROOT_DIR, subMatch[1]);
      if (fs.existsSync(nestedPath) && !fs.statSync(nestedPath).isDirectory()) {
        const ext = path.extname(nestedPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(nestedPath).pipe(res);
        return;
      }
    }
  }

  // ==========================================
  // 5. CLEAN URL REDIRECTIONS: REMOVE .HTML & ENFORCE TRAILING SLASH (301)
  // ==========================================
  if (!isAsset && !pathname.startsWith('/api/')) {
    // A. Strip .html / .htm and redirect with trailing slash (301)
    if (/\\.html?$/i.test(pathname)) {
      const cleanPath = pathname.replace(/\\.html?$/i, '');
      const redirectTarget = (cleanPath === '/index' || cleanPath === '') ? '/' : \`\${cleanPath}/\`;
      const redirectUrl = redirectTarget + (parsedUrl.search || '') + (parsedUrl.hash || '');
      res.writeHead(301, { 'Location': redirectUrl });
      res.end();
      return;
    }

    // B. Enforce trailing slash for all non-root page paths missing trailing slash (301)
    if (pathname !== '/' && !pathname.endsWith('/')) {
      const redirectUrl = \`\${pathname}/\` + (parsedUrl.search || '') + (parsedUrl.hash || '');
      res.writeHead(301, { 'Location': redirectUrl });
      res.end();
      return;
    }
  }

  // ==========================================
  // 6. ROUTER ENDPOINTS (CANONICAL TRAILING-SLASH CLEAN URLS)
  // ==========================================

  // --- A. Root Homepage: / ---
  if (pathname === '/') {
    const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexHtmlPath).pipe(res);
      return;
    }
  }

  // --- B. Public Catalogue: /product/ and /product/page/:num/ ---
  const catalogueMatch = pathname.match(/^\\/product\\/(?:page\\/(\\d+)\\/)?$/i);
  if (catalogueMatch) {
    const productHtmlPath = path.join(ROOT_DIR, 'product.html');
    if (fs.existsSync(productHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(productHtmlPath).pipe(res);
      return;
    }
  }

  // --- C. Product Category Catalogue: /product-category/:category/ and /product-category/:category/page/:num/ ---
  const categoryMatch = pathname.match(/^\\/product-category\\/([a-zA-Z0-9_-]+)\\/(?:page\\/(\\d+)\\/)?$/i);
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
        <a href="/">Home</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="/product/">Product</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="/product-category/\${category}/">\${meta.breadcrumb}</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <span>Page \${pageNum}</span>
      \` : \`
        <a href="/">Home</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <a href="/product/">Product</a>
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
  }

  // --- D. Dynamic Product Slug Page: /product/:slug/ -> serves product-detail.html ---
  const productSlugMatch = pathname.match(/^\\/product\\/([a-zA-Z0-9_-]+)\\/$/i);
  if (productSlugMatch) {
    const slug = productSlugMatch[1];
    if (slug.toLowerCase() !== 'page') {
      const detailHtmlPath = path.join(ROOT_DIR, 'product-detail.html');
      if (fs.existsSync(detailHtmlPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(detailHtmlPath).pipe(res);
        return;
      }
    }
  }

  // --- E. Admin Authentication & Subpages: /admin/ and /admin/login/ ---
  if (pathname.toLowerCase() === '/admin/login/') {
    if (isAuthorized(req)) {
      res.writeHead(302, { 'Location': '/admin/' });
      res.end();
      return;
    }
    const loginHtmlPath = path.join(ROOT_DIR, 'admin', 'login.html');
    if (fs.existsSync(loginHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(loginHtmlPath).pipe(res);
      return;
    }
  }

  const adminMatch = pathname.match(/^\\/admin\\/(?:([a-zA-Z0-9_-]+)\\/)?(?:page\\/(\\d+)\\/)?$/i);
  if (adminMatch && !isAsset) {
    if (!isAuthorized(req)) {
      const redirectParam = pathname !== '/admin/' ? \`?redirect=\${encodeURIComponent(pathname + (parsedUrl.search || ''))}\` : '';
      res.writeHead(302, { 'Location': \`/admin/login/\${redirectParam}\` });
      res.end();
      return;
    }

    const adminIndexHtml = path.join(ROOT_DIR, 'admin', 'index.html');
    if (fs.existsSync(adminIndexHtml)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(adminIndexHtml).pipe(res);
      return;
    }
  }

  // --- F. Standard Site Pages: /:pageName/ -> serves :pageName.html or :pageName/index.html ---
  const sitePageMatch = pathname.match(/^\\/([a-zA-Z0-9_-]+)\\/$/i);
  if (sitePageMatch) {
    const pageName = sitePageMatch[1].toLowerCase();
    const directHtml = path.join(ROOT_DIR, \`\${pageName}.html\`);
    const mirrorHtml = path.join(ROOT_DIR, pageName, 'index.html');
    const targetHtml = fs.existsSync(directHtml) ? directHtml : (fs.existsSync(mirrorHtml) ? mirrorHtml : null);

    if (targetHtml) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(targetHtml).pipe(res);
      return;
    }
  }

  // ==========================================
  // 7. 404 NOT FOUND FALLBACK
  // ==========================================
  res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end(\`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>404 - Page Not Found</h1><p>The requested file <code>\${pathname}</code> does not exist.</p><a href="/" style="color:#d32f2f;">Return to Homepage</a></body></html>\`);
}

// Create Main Server
const server = http.createServer(requestDispatcher);

// Primary server error listener
server.on('error', (err) => {
  console.error(' [Server Guard] Primary Server Error:', err.message);
});

// Global process crash prevention
process.on('uncaughtException', (err) => {
  console.error(' [Server Guard] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error(' [Server Guard] Unhandled Rejection:', reason && reason.message ? reason.message : reason);
});

// Start Server on 0.0.0.0 (Port 8080)
server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log('   HARICHAND STEEL - ENTERPRISE CLEAN URL SERVER RUNNING        ');
  console.log('================================================================');
  console.log(\` > Primary Server:  http://0.0.0.0:\${PORT}/ (Port \${PORT})\`);
  console.log(\` > Localhost URL:   http://localhost:\${PORT}/\`);
  console.log(\` > Network / LAN:   http://192.168.88.57:\${PORT}/\`);
  console.log(\` > CMS Dashboard:   http://localhost:\${PORT}/admin/\`);
  console.log(\` > Products Page:   http://localhost:\${PORT}/product/\`);
  console.log(\` > Single Product:  http://localhost:\${PORT}/product/aluminium-door-profile-gate/\`);
  try {
    const mdSummary = markdownSync.syncAll();
    console.log(\` > Markdown Content: \${mdSummary.pages.length} Pages, \${mdSummary.products.length} Products, \${mdSummary.blogs.length} Blogs\`);
  } catch (_) {}
  console.log('----------------------------------------------------------------');
  const dbHost = process.env.DATABASE_URL ? (new URL(process.env.DATABASE_URL.replace(/^postgresql:\\/\\//i, 'http://')).host || 'Supabase') : 'Local JSON';
  console.log(\` Database Target:   \${dbHost}\`);
  console.log('================================================================');
});

// Also start secondary listener on port 3000 if PORT is 8080
if (PORT != ALT_PORT) {
  try {
    const altServer = http.createServer(requestDispatcher);
    altServer.listen(ALT_PORT, '0.0.0.0', () => {
      console.log(\` > Secondary Server: http://localhost:\${ALT_PORT}/ (Port \${ALT_PORT})\`);
    });
    altServer.on('error', (err) => {
      console.log(\` [Notice] Port \${ALT_PORT} not bound: \${err.message}\`);
    });
  } catch (_) { }
}
`;

fs.writeFileSync(serverJsPath, (beforeRouter + newRouterAndStatic).replace(/\n/g, '\r\n'), 'utf8');
console.log('✓ server.js successfully rewritten with strict trailing-slash clean URL architecture!');
