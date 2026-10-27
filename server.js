/**
 * HARICHAND STEEL - Lightweight Zero-Dependency Server & Supabase CMS Backend
 * Built with native Node.js (http, fs, path) and Supabase PostgreSQL (pg)
 * Run: node server.js
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db.js');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

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

// Helper to read JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Safeguard max 25MB payload for base64 images
      if (body.length > 25 * 1024 * 1024) {
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
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Request dispatcher
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ==========================================
  // API ROUTES (Powered by db.js & Supabase)
  // ==========================================

  // --- /api/db-status ---
  if (pathname === '/api/db-status' && req.method === 'GET') {
    sendJson(res, 200, db.getStatus());
    return;
  }

  // --- /api/products ---
  if (pathname === '/api/products') {
    if (req.method === 'GET') {
      try {
        const products = await db.getProducts();
        sendJson(res, 200, products);
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to read products' });
      }
      return;
    }

    if (req.method === 'POST') {
      try {
        const data = await parseJsonBody(req);
        if (Array.isArray(data)) {
          for (const item of data) {
            await db.saveProduct(item);
          }
          sendJson(res, 200, { success: true, count: data.length });
        } else {
          const saved = await db.saveProduct(data);
          sendJson(res, 200, { success: true, product: saved });
        }
      } catch (e) {
        sendJson(res, 400, { error: 'Invalid JSON or database save error' });
      }
      return;
    }

    if (req.method === 'DELETE') {
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
    if (req.method === 'GET') {
      try {
        const blogs = await db.getBlogs();
        sendJson(res, 200, blogs);
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to read blogs' });
      }
      return;
    }

    if (req.method === 'POST') {
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
        sendJson(res, 400, { error: 'Invalid JSON or database save error' });
      }
      return;
    }

    if (req.method === 'DELETE') {
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
    if (req.method === 'GET') {
      try {
        const inquiries = await db.getInquiries();
        sendJson(res, 200, inquiries);
      } catch (e) {
        sendJson(res, 500, { error: 'Failed to read inquiries' });
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
        sendJson(res, 400, { error: 'Invalid inquiry payload' });
      }
      return;
    }
  }

  // ==========================================
  // STATIC FILE SERVING & CLEAN ROUTING
  // ==========================================

  // Redirect /admin to /admin/
  if (pathname === '/admin') {
    res.writeHead(301, { 'Location': '/admin/' });
    res.end();
    return;
  }

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
});

// Start Server
server.listen(PORT, () => {
  console.log('================================================================');
  console.log('   HARICHAND STEEL - WEBSITE & SUPABASE CMS RUNNING             ');
  console.log('================================================================');
  console.log(` > Website URL:    http://localhost:${PORT}/`);
  console.log(` > CMS Dashboard:  http://localhost:${PORT}/admin/`);
  console.log(` > Products Page:  http://localhost:${PORT}/product.html`);
  console.log(` > News & Blogs:   http://localhost:${PORT}/news.html`);
  console.log(` > Contact Page:   http://localhost:${PORT}/contact.html`);
  console.log('----------------------------------------------------------------');
  console.log(' Database Target: db.uxazybwdglgvmnmjetoy.supabase.co:5432');
  console.log('----------------------------------------------------------------');
  console.log(' Press Ctrl+C in your terminal to stop the server.');
  console.log('================================================================');
});
