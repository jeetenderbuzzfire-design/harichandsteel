const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, '..', 'server.js');
let code = fs.readFileSync(serverJsPath, 'utf8');

// 1. Update Trailing Slash middleware to protect /product-category/ and enforce its trailing slash
const oldTrailingSlash = `  if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanPath = pathname.replace(/\\/+$/, '');
    const redirectUrl = cleanPath + (parsedUrl.search || '') + (parsedUrl.hash || '');
    res.writeHead(301, { 'Location': redirectUrl });
    res.end();
    return;
  }`;

const newTrailingSlash = `  // For /product-category/ paths, enforce trailing slash: /product-category/:slug -> /product-category/:slug/
  if (pathname.startsWith('/product-category/') || pathname === '/product-category') {
    if (!pathname.endsWith('/')) {
      const redirectUrl = pathname + '/' + (parsedUrl.search || '') + (parsedUrl.hash || '');
      res.writeHead(301, { 'Location': redirectUrl });
      res.end();
      return;
    }
  } else if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanPath = pathname.replace(/\\/+$/, '');
    const redirectUrl = cleanPath + (parsedUrl.search || '') + (parsedUrl.hash || '');
    res.writeHead(301, { 'Location': redirectUrl });
    res.end();
    return;
  }`;

if (code.includes(oldTrailingSlash)) {
  code = code.replace(oldTrailingSlash, newTrailingSlash);
  console.log('Updated trailing slash middleware for /product-category/');
} else {
  console.log('Could not match old trailing slash block or already updated');
}

// 2. Add Nested Asset Serving for /product-category/
const targetAssetHook = `  // Assets inside /product/ (e.g. /product/./css/style.css, /product/page/2/js/main.js)`;
const newAssetBlock = `  // Assets inside /product-category/ (e.g. /product-category/steel-door/css/style.css)
  if (pathname.startsWith('/product-category/') && /\\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf)$/i.test(pathname)) {
    const assetMatch = pathname.match(/\\/product-category\\/.*?\\/(css\\/[^\\/]+|js\\/[^\\/]+|images\\/[^\\/]+|webfonts\\/[^\\/]+)$/);
    if (assetMatch) {
      const assetPath = path.join(ROOT_DIR, assetMatch[1]);
      if (fs.existsSync(assetPath) && !fs.statSync(assetPath).isDirectory()) {
        const ext = path.extname(assetPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(assetPath).pipe(res);
        return;
      }
    }
  }

  // Assets inside /product/ (e.g. /product/./css/style.css, /product/page/2/js/main.js)`;

if (!code.includes("pathname.startsWith('/product-category/')") && code.includes(targetAssetHook)) {
  code = code.replace(targetAssetHook, newAssetBlock);
  console.log('Added nested asset serving for /product-category/');
}

// 3. Add Router Endpoint for /product-category/:category/ and /product-category/:category/page/:num/
const targetRouteHook = `  // --- B. Dynamic Product Slug Page: /product/:slug -> serves product-detail.html ---`;
const newCategoryRoute = `  // --- B1. Product Category Catalogue: /product-category/:category/ and /product-category/:category/page/:num/ ---
  const categoryMatch = pathname.match(/^\\/product-category\\/([a-zA-Z0-9_-]+)(?:\\/page\\/(\\d+))?\\/?$/i);
  if (categoryMatch) {
    const productHtmlPath = path.join(ROOT_DIR, 'product.html');
    if (fs.existsSync(productHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(productHtmlPath).pipe(res);
      return;
    }
  }

  // --- B. Dynamic Product Slug Page: /product/:slug -> serves product-detail.html ---`;

if (!code.includes("const categoryMatch = pathname.match(/^\\/product-category") && code.includes(targetRouteHook)) {
  code = code.replace(targetRouteHook, newCategoryRoute);
  console.log('Added router endpoint for /product-category/:category/');
}

fs.writeFileSync(serverJsPath, code, 'utf8');
console.log('Successfully updated server.js!');
