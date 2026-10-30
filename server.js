/**
 * HARICHAND STEEL - Enterprise Clean URL Server & Supabase CMS Backend
 * Built with native Node.js (http, fs, path) and Supabase PostgreSQL (pg)
 * Run: node server.js
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db.js');

const PORT = process.env.PORT || 8080;
const ALT_PORT = 3000;
const ROOT_DIR = __dirname;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'hs_admin_secret_key_2026';

// Helper to validate administrative access
function isAuthorized(req) {
  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'];
  if (headerKey && headerKey === ADMIN_API_KEY) return true;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && (parts[0] === 'Bearer' || parts[0] === 'ApiKey') && parts[1] === ADMIN_API_KEY) {
      return true;
    }
  }
  return false;
}

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8'
};

// Helper to read JSON request body (DOS-01: max 2MB payload safeguard)
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Safeguard max 2MB payload to prevent heap exhaustion / OOM
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON responses
function sendJson(res, statusCode, data, method = 'GET') {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key'
  });
  if (method === 'HEAD') {
    res.end();
  } else {
    res.end(JSON.stringify(data));
  }
}

// Central Request Dispatcher
async function requestDispatcher(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key'
    });
    res.end();
    return;
  }

  // ==========================================
  // 1. GLOBAL STRIP TRAILING SLASH MIDDLEWARE (HTTP 301)
  // If pathname.length > 1 and pathname.endsWith('/'), strip all trailing slashes
  // and immediately issue an HTTP 301 redirect to the clean URL without a trailing slash.
  // Example: /admin/products/ -> /admin/products
  // Example: /product/aluminium-door-profile-gate/ -> /product/aluminium-door-profile-gate
  // ==========================================
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanPath = pathname.replace(/\/+$/, '');
    const redirectUrl = cleanPath + (parsedUrl.search || '') + (parsedUrl.hash || '');
    res.writeHead(301, { 'Location': redirectUrl });
    res.end();
    return;
  }

  // ==========================================
  // 2. ASSET ALIASING
  // ==========================================
  // Handle favicon requests (/images/favicon.ico, /favicon.ico, etc.)
  if (pathname === '/images/favicon.ico' || pathname === '/favicon.ico' || pathname.endsWith('/favicon.ico')) {
    const faviconIco = path.join(ROOT_DIR, 'images', 'favicon.ico');
    const faviconJpeg = path.join(ROOT_DIR, 'images', 'favicon-32.jpeg');
    let faviconPath = null;
    let faviconType = 'image/x-icon';

    if (fs.existsSync(faviconIco)) {
      faviconPath = faviconIco;
      faviconType = 'image/x-icon';
    } else if (fs.existsSync(faviconJpeg)) {
      faviconPath = faviconJpeg;
      faviconType = 'image/jpeg';
    }

    if (faviconPath) {
      res.writeHead(200, { 'Content-Type': faviconType });
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      fs.createReadStream(faviconPath).pipe(res);
      return;
    } else {
      res.writeHead(204);
      res.end();
      return;
    }
  }

  // Map /images/logo.png -> images/logo.jpeg
  if (pathname === '/images/logo.png' || pathname.endsWith('/images/logo.png') || pathname.endsWith('/logo.png')) {
    const logoJpeg = path.join(ROOT_DIR, 'images', 'logo.jpeg');
    if (fs.existsSync(logoJpeg)) {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      fs.createReadStream(logoJpeg).pipe(res);
      return;
    }
  }

  // ==========================================
  // 3. API ROUTES (Powered by db.js & Supabase)
  // ==========================================

  // --- /api/db-status ---
  if (pathname === '/api/db-status' && (req.method === 'GET' || req.method === 'HEAD')) {
    try {
      const dbStatus = await db.checkConnection();
      sendJson(res, 200, dbStatus, req.method);
    } catch (err) {
      sendJson(res, 200, { status: "local_fallback", database: "JSON" }, req.method);
    }
    return;
  }

  // --- /api/products ---
  if (pathname === '/api/products') {
    if (req.method === 'GET' || req.method === 'HEAD') {
      try {
        const products = await db.getProducts();
        sendJson(res, 200, products, req.method);
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to read products' }, req.method);
      }
      return;
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      if (!isAuthorized(req)) {
        return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' });
      }
      try {
        const data = await parseJsonBody(req);
        const productsFile = path.join(ROOT_DIR, 'data', 'products.json');
        let currentProducts = [];
        try {
          if (fs.existsSync(productsFile)) {
            currentProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
          }
        } catch (e) {
          currentProducts = [];
        }

        function normalizeItem(item) {
          if (!item.id) item.id = 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
          if (!item.createdAt) item.createdAt = new Date().toISOString().split('T')[0];
          if (!item.slug && item.title) {
            item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          }
          if (!item.outerFrame) item.outerFrame = '14 Gauge (14G) steel frame';
          if (!item.innerFrame) item.innerFrame = '16 Gauge (16G) steel frame';
          if (!item.usage) item.usage = 'Residential, commercial, industrial entrances';
          if (!item.finish) item.finish = 'Powder coated or painted';
          if (!item.hardware) item.hardware = 'Heavy-duty sealed stainless-steel ball bearing hinges / Italian rolling track';
          if (!item.automation) item.automation = '100% compatible with motorized remote swing & sliding gate operators';
          return item;
        }

        if (Array.isArray(data)) {
          for (let item of data) {
            item = normalizeItem(item);
            const idx = currentProducts.findIndex(p => p.id === item.id || (item.slug && p.slug === item.slug));
            if (idx !== -1) {
              currentProducts[idx] = { ...currentProducts[idx], ...item };
            } else {
              currentProducts.unshift(item);
            }
            if (db && typeof db.saveProduct === 'function') {
              try { await db.saveProduct(item); } catch (_) { }
            }
          }
          fs.writeFileSync(productsFile, JSON.stringify(currentProducts, null, 2), 'utf8');
          sendJson(res, 200, { success: true, count: data.length });
        } else if (data && typeof data === 'object') {
          const item = normalizeItem(data);
          const idx = currentProducts.findIndex(p => p.id === item.id || (item.slug && p.slug === item.slug));
          if (idx !== -1) {
            currentProducts[idx] = { ...currentProducts[idx], ...item };
          } else {
            currentProducts.unshift(item);
          }
          fs.writeFileSync(productsFile, JSON.stringify(currentProducts, null, 2), 'utf8');
          if (db && typeof db.saveProduct === 'function') {
            try { await db.saveProduct(item); } catch (_) { }
          }
          sendJson(res, 200, { success: true, product: item });
        } else {
          sendJson(res, 400, { error: 'Invalid product payload' });
        }
      } catch (e) {
        if (e.message === 'Payload too large') {
          return sendJson(res, 400, { error: 'Payload too large (max 2MB)' });
        }
        sendJson(res, 400, { error: 'Invalid JSON or database save error' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) {
        return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' });
      }
      try {
        const id = parsedUrl.searchParams.get('id');
        if (id) {
          await db.deleteProduct(id);
          sendJson(res, 200, { success: true, id });
        } else {
          sendJson(res, 400, { error: 'Product ID required' });
        }
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to delete product' });
      }
      return;
    }
  }

  // --- /api/blogs ---
  if (pathname === '/api/blogs') {
    if (req.method === 'GET' || req.method === 'HEAD') {
      try {
        const blogs = await db.getBlogs();
        sendJson(res, 200, blogs, req.method);
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to read blogs' }, req.method);
      }
      return;
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      if (!isAuthorized(req)) {
        return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' });
      }
      try {
        const data = await parseJsonBody(req);
        if (Array.isArray(data)) {
          for (const item of data) {
            await db.saveBlog(item);
          }
          sendJson(res, 200, { success: true, count: data.length });
        } else {
          const saved = await db.saveBlog(data);
          sendJson(res, 200, { success: true, blog: saved });
        }
      } catch (e) {
        if (e.message === 'Payload too large') {
          return sendJson(res, 400, { error: 'Payload too large (max 2MB)' });
        }
        sendJson(res, 400, { error: 'Invalid JSON or database save error' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) {
        return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' });
      }
      try {
        const id = parsedUrl.searchParams.get('id');
        if (id) {
          await db.deleteBlog(id);
          sendJson(res, 200, { success: true, id });
        } else {
          sendJson(res, 400, { error: 'Blog ID required' });
        }
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to delete blog' });
      }
      return;
    }
  }

  // --- /api/inquiries ---
  if (pathname === '/api/inquiries') {
    if (req.method === 'GET' || req.method === 'HEAD') {
      if (!isAuthorized(req)) {
        return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' }, req.method);
      }
      try {
        const inquiries = await db.getInquiries();
        sendJson(res, 200, inquiries, req.method);
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to read inquiries' }, req.method);
      }
      return;
    }

    if (req.method === 'POST') {
      try {
        const newInq = await parseJsonBody(req);
        if (Array.isArray(newInq)) {
          for (const item of newInq) {
            await db.saveInquiry(item);
          }
          sendJson(res, 200, { success: true, count: newInq.length });
        } else {
          const saved = await db.saveInquiry(newInq);
          sendJson(res, 200, { success: true, inquiry: saved });
        }
      } catch (e) {
        if (e.message === 'Payload too large') {
          return sendJson(res, 400, { error: 'Payload too large (max 2MB)' });
        }
        sendJson(res, 400, { error: 'Invalid inquiry payload' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) {
        return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' });
      }
      try {
        const id = parsedUrl.searchParams.get('id');
        if (id) {
          await db.deleteInquiry(id);
          sendJson(res, 200, { success: true, id });
        } else {
          sendJson(res, 400, { error: 'Inquiry ID required' });
        }
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to delete inquiry' });
      }
      return;
    }
  }

  // ==========================================
  // 4. NESTED ASSET SERVING FOR /product/ & /admin/
  // ==========================================

  // Assets inside /product/ (e.g. /product/./css/style.css, /product/page/2/js/main.js)
  if (pathname.startsWith('/product/') && /\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf)$/i.test(pathname)) {
    const assetMatch = pathname.match(/\/product\/.*?\/(css\/[^\/]+|js\/[^\/]+|images\/[^\/]+)$/);
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

  // Assets inside /admin/ (e.g. /admin/css/admin.css, /admin/products/page/2/js/admin.js)
  if (pathname.startsWith('/admin/') && /\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf)$/i.test(pathname)) {
    const assetMatch = pathname.match(/\/admin\/.*?\/(css\/[^\/]+|js\/[^\/]+)$/);
    if (assetMatch) {
      const subAssetPath = path.join(ROOT_DIR, 'admin', assetMatch[1]);
      if (fs.existsSync(subAssetPath) && !fs.statSync(subAssetPath).isDirectory()) {
        const ext = path.extname(subAssetPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(subAssetPath).pipe(res);
        return;
      }
    }
    const imageMatch = pathname.match(/\/images\/([^\/]+)$/);
    if (imageMatch) {
      const imgPath = path.join(ROOT_DIR, 'images', imageMatch[1]);
      if (fs.existsSync(imgPath) && !fs.statSync(imgPath).isDirectory()) {
        const ext = path.extname(imgPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'image/jpeg';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(imgPath).pipe(res);
        return;
      }
    }
  }

  // ==========================================
  // 5. ROUTER ENDPOINTS (STRICT CLEAN URLS WITHOUT TRAILING SLASH)
  // ==========================================

  // --- A. Public Catalogue: /product and /product/page/:num ---
  const catalogueMatch = pathname.match(/^\/product(?:\/page(?:\/(\d+))?)?$/i);
  if (catalogueMatch) {
    const productHtmlPath = path.join(ROOT_DIR, 'product.html');
    if (fs.existsSync(productHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(productHtmlPath).pipe(res);
      return;
    }
  }

  // --- B. Dynamic Product Slug Page: /product/:slug -> serves product-detail.html ---
  // Before any static file or fallback check, capture all dynamic product slug paths matching: /^\/product\/([a-zA-Z0-9_-]+)\/?$/i
  const productSlugMatch = pathname.match(/^\/product\/([a-zA-Z0-9_-]+)\/?$/i);
  if (productSlugMatch) {
    const slug = productSlugMatch[1];
    if (slug.toLowerCase() !== 'page') {
      if (pathname.endsWith('/') || (req.url && req.url.split('?')[0].endsWith('/'))) {
        const cleanPath = `/product/${slug}`;
        const redirectUrl = cleanPath + (parsedUrl.search || '') + (parsedUrl.hash || '');
        res.writeHead(301, { 'Location': redirectUrl });
        res.end();
        return;
      }
      const detailHtmlPath = path.join(ROOT_DIR, 'product-detail.html');
      if (fs.existsSync(detailHtmlPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(detailHtmlPath).pipe(res);
        return;
      }
    }
  }

  // --- C. Admin Fallback for Root HTML Articles (e.g. /admin/steel-gate-design.html) ---
  const adminHtmlMatch = pathname.match(/^\/admin\/([a-zA-Z0-9_.-]+\.html)$/i);
  if (adminHtmlMatch && !fs.existsSync(path.join(ROOT_DIR, 'admin', adminHtmlMatch[1]))) {
    const rootHtml = path.join(ROOT_DIR, adminHtmlMatch[1]);
    if (fs.existsSync(rootHtml)) {
      res.writeHead(301, { 'Location': `/${adminHtmlMatch[1]}${parsedUrl.search || ''}` });
      res.end();
      return;
    }
  }

  // --- D. Admin Dashboard & Subpages: /admin and /admin/:section -> serves admin/index.html ---
  // Matches /admin, /admin/products, /admin/inquiries, /admin/blogs, /admin/settings, /admin/:section/page/:num
  const adminMatch = pathname.match(/^\/admin(?:\/([a-zA-Z0-9_-]+))?(?:\/page\/(\d+))?$/i);
  if (adminMatch) {
    // If it's not a static asset, serve admin/index.html with 200 OK
    if (!/\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf)$/i.test(pathname)) {
      const adminIndexHtml = path.join(ROOT_DIR, 'admin', 'index.html');
      if (fs.existsSync(adminIndexHtml)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        fs.createReadStream(adminIndexHtml).pipe(res);
        return;
      }
    }
  }

  // ==========================================
  // 6. STATIC FILE SERVING FALLBACK
  // ==========================================
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = path.join(ROOT_DIR, relativePath);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Handle clean folder routing (e.g. /product/ -> /product/index.html or /admin/ -> /admin/index.html)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexInDir = path.join(filePath, 'index.html');
    if (fs.existsSync(indexInDir)) {
      filePath = indexInDir;
    }
  }

  // If path doesn't exist, try appending .html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }
  if (!fs.existsSync(filePath)) {
    const trimmedPath = filePath.replace(/[\\\/]+$/, '');
    if (fs.existsSync(trimmedPath + '.html')) {
      filePath = trimmedPath + '.html';
    }
  }

  // Check file existence
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>404 - Page Not Found</h1><p>The requested file <code>${pathname}</code> does not exist.</p><a href="/" style="color:#d32f2f;">Return to Homepage</a></body></html>`);
    return;
  }

  // Stream static file
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
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
  console.log(` > Primary Server:  http://0.0.0.0:${PORT}/ (Port ${PORT})`);
  console.log(` > Localhost URL:   http://localhost:${PORT}/`);
  console.log(` > Network / LAN:   http://192.168.88.57:${PORT}/`);
  console.log(` > CMS Dashboard:   http://localhost:${PORT}/admin`);
  console.log(` > Products Page:   http://localhost:${PORT}/product`);
  console.log(` > Single Product:  http://localhost:${PORT}/product/aluminium-door-profile-gate`);
  console.log('----------------------------------------------------------------');
  console.log(' Database Target:   db.uxazybwdglgvmnmjetoy.supabase.co:5432');
  console.log('================================================================');
});

// Also start secondary listener on port 3000 if PORT is 8080
if (PORT != ALT_PORT) {
  try {
    const altServer = http.createServer(requestDispatcher);
    altServer.listen(ALT_PORT, '0.0.0.0', () => {
      console.log(` > Secondary Server: http://localhost:${ALT_PORT}/ (Port ${ALT_PORT})`);
    });
    altServer.on('error', (err) => {
      console.log(` [Notice] Port ${ALT_PORT} not bound: ${err.message}`);
    });
  } catch (_) { }
}
