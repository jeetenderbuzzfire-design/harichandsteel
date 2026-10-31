const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, '..', 'server.js');
let code = fs.readFileSync(serverJsPath, 'utf8');

const regex = /if\s*\(\s*pathname\.length\s*>\s*1\s*&&\s*pathname\.endsWith\('\/'\)\s*\)\s*\{[\s\S]*?res\.writeHead\(301[\s\S]*?return;\s*\}/;

const replacement = `// For /product-category/ paths, enforce trailing slash: /product-category/:slug -> /product-category/:slug/
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

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync(serverJsPath, code, 'utf8');
  console.log('Successfully updated trailing slash middleware in server.js');
} else {
  console.log('Regex did not match');
}
