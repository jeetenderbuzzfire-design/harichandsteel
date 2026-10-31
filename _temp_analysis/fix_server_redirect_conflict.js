const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverJsPath = path.join(rootDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Replace the old section 1 (lines 163-185)
const oldSection1 = `  // ==========================================
  // 1. GLOBAL STRIP TRAILING SLASH MIDDLEWARE (HTTP 301)
  // If pathname.length > 1 and pathname.endsWith('/'), strip all trailing slashes
  // and immediately issue an HTTP 301 redirect to the clean URL without a trailing slash.
  // Example: /admin/products/ -> /admin/products
  // Example: /product/aluminium-door-profile-gate/ -> /product/aluminium-door-profile-gate
  // ==========================================
  // For /product-category/ paths, enforce trailing slash: /product-category/:slug -> /product-category/:slug/
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

const newSection1 = `  // ==========================================
  // 1. GLOBAL CLEAN URL & TRAILING SLASH MIDDLEWARE (HTTP 301)
  // Enforces removal of .html and presence of trailing slash for all page URLs.
  // Example: /about-us.html -> /about-us/
  // Example: /about-us -> /about-us/
  // Example: /product/aluminium-door-profile-gate -> /product/aluminium-door-profile-gate/
  // ==========================================
  const isStaticAsset = /\\.(css|js|png|jpg|jpeg|svg|ico|webp|json|txt|woff2?|ttf|eot|xml)$/i.test(pathname);
  if (!isStaticAsset && !pathname.startsWith('/api/')) {
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
  }`;

if (serverJs.includes(oldSection1)) {
  serverJs = serverJs.replace(oldSection1, newSection1);
  console.log('✓ Section 1 middleware updated.');
} else {
  console.log('Old section 1 not found verbatim, searching by pattern...');
  serverJs = serverJs.replace(
    /\/\/ ==========================================\s*\/\/ 1\. GLOBAL STRIP TRAILING SLASH MIDDLEWARE[\s\S]*?return;\s*\}/,
    newSection1.trim()
  );
  console.log('✓ Section 1 middleware replaced by regex pattern.');
}

// 2. Remove duplicate section 5 below section 4
const duplicateSection5 = `  // ==========================================
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

`;

if (serverJs.includes(duplicateSection5)) {
  serverJs = serverJs.replace(duplicateSection5, '');
  console.log('✓ Duplicate section 5 removed.');
}

fs.writeFileSync(serverJsPath, serverJs.replace(/\n/g, '\r\n'), 'utf8');
console.log('✓ server.js updated!');
