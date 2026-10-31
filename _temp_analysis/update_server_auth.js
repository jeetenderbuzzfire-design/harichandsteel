const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, '..', 'server.js');
let code = fs.readFileSync(serverJsPath, 'utf8');

// 1. Update Header / Crypto / Auth Helpers
const oldAuthHelperRegex = /const ADMIN_API_KEY = process\.env\.ADMIN_API_KEY \|\| 'hs_admin_secret_key_2026';\r?\n\r?\n\/\/ Helper to validate administrative access\r?\nfunction isAuthorized\(req\) \{[\s\S]*?return false;\r?\n\}/;

const newAuthHelperBlock = `const crypto = require('crypto');
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'hs_admin_secret_key_2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Harichand@2026';

// In-memory active admin sessions: token -> { username, createdAt }
const activeAdminSessions = new Map();

// Helper to parse cookies from request
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

// Helper to validate administrative access (API key OR active session token/cookie)
function isAuthorized(req) {
  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'];
  
  if (headerKey) {
    if (headerKey === ADMIN_API_KEY) return true;
    if (activeAdminSessions.has(headerKey)) return true;
  }
  
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && (parts[0] === 'Bearer' || parts[0] === 'ApiKey')) {
      if (parts[1] === ADMIN_API_KEY) return true;
      if (activeAdminSessions.has(parts[1])) return true;
    }
  }

  // Check session cookie
  const cookies = parseCookies(req);
  if (cookies.hs_admin_session && activeAdminSessions.has(cookies.hs_admin_session)) {
    return true;
  }

  return false;
}`;

if (oldAuthHelperRegex.test(code)) {
  code = code.replace(oldAuthHelperRegex, newAuthHelperBlock);
  console.log('Updated auth helper block in server.js');
} else {
  console.error('Could not match oldAuthHelperRegex');
  process.exit(1);
}

// 2. Add Auth API Endpoints (/api/admin/login, /api/admin/check-auth, /api/admin/logout)
const apiProductsHook = `  // --- /api/products ---`;
const newAuthEndpoints = `  // --- /api/admin/login ---
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      const user = (data.username || '').trim();
      const pass = (data.password || '').trim();
      const validUser = (process.env.ADMIN_USERNAME || 'admin').trim();
      const validPass = (process.env.ADMIN_PASSWORD || 'Harichand@2026').trim();

      if (user === validUser && pass === validPass) {
        const sessionToken = 'hs_sess_' + crypto.randomBytes(24).toString('hex');
        activeAdminSessions.set(sessionToken, { username: user, createdAt: Date.now() });

        // Set secure HTTP cookie valid for 7 days
        res.setHeader('Set-Cookie', \`hs_admin_session=\${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800\`);
        return sendJson(res, 200, {
          success: true,
          message: 'Login successful',
          token: sessionToken,
          apiKey: ADMIN_API_KEY,
          username: user
        });
      } else {
        return sendJson(res, 401, {
          success: false,
          error: 'Invalid username or password'
        });
      }
    } catch (e) {
      return sendJson(res, 400, { success: false, error: 'Invalid request body' });
    }
  }

  // --- /api/admin/check-auth ---
  if (pathname === '/api/admin/check-auth' && (req.method === 'GET' || req.method === 'HEAD')) {
    const authorized = isAuthorized(req);
    let username = 'admin';
    const cookies = parseCookies(req);
    if (cookies.hs_admin_session && activeAdminSessions.has(cookies.hs_admin_session)) {
      username = activeAdminSessions.get(cookies.hs_admin_session).username;
    }
    return sendJson(res, 200, { authenticated: authorized, username }, req.method);
  }

  // --- /api/admin/logout ---
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const cookies = parseCookies(req);
    if (cookies.hs_admin_session) {
      activeAdminSessions.delete(cookies.hs_admin_session);
    }
    const headerKey = req.headers['x-admin-key'];
    if (headerKey && activeAdminSessions.has(headerKey)) {
      activeAdminSessions.delete(headerKey);
    }
    res.setHeader('Set-Cookie', 'hs_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
    return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
  }

  // --- /api/products ---`;

if (code.includes(apiProductsHook)) {
  code = code.replace(apiProductsHook, newAuthEndpoints);
  console.log('Added auth API endpoints to server.js');
} else {
  console.error('Could not find /api/products hook');
  process.exit(1);
}

// 3. Update Admin router with /admin/login and auth protection
const oldAdminRouteRegex = /\/\/ --- D\. Admin Dashboard & Subpages[\s\S]*?const adminMatch = pathname\.match\(\/\^\\\/admin[\s\S]*?return;\r?\n\s*\}\r?\n\s*\}\r?\n\s*\}/;

const newAdminRouteBlock = `// --- D. Admin Authentication & Subpages ---
  if (pathname.toLowerCase() === '/admin/login') {
    if (isAuthorized(req)) {
      res.writeHead(302, { 'Location': '/admin' });
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

  const adminMatch = pathname.match(/^\\/admin(?:\\/([a-zA-Z0-9_-]+))?(?:\\/page\\/(\\d+))?$/i);
  if (adminMatch) {
    // If it's not a static asset
    if (!/\\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf)$/i.test(pathname)) {
      // Block unauthenticated access and redirect to /admin/login
      if (!isAuthorized(req)) {
        const redirectParam = pathname !== '/admin' ? \`?redirect=\${encodeURIComponent(pathname + (parsedUrl.search || ''))}\` : '';
        res.writeHead(302, { 'Location': \`/admin/login\${redirectParam}\` });
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
  }`;

if (oldAdminRouteRegex.test(code)) {
  code = code.replace(oldAdminRouteRegex, newAdminRouteBlock);
  console.log('Updated admin routing with login redirect in server.js');
} else {
  console.error('Could not match oldAdminRouteRegex');
  process.exit(1);
}

// 4. Update Admin asset serving to include webfonts
code = code.replace(
  `pathname.match(/\\/admin\\/.*?\\/(css\\/[^\\/]+|js\\/[^\\/]+)$/)`,
  `pathname.match(/\\/admin\\/.*?\\/(css\\/[^\\/]+|js\\/[^\\/]+|webfonts\\/[^\\/]+)$/)`
);

fs.writeFileSync(serverJsPath, code, 'utf8');
console.log('server.js updated successfully!');
