const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update server.js MIME_TYPES
const serverPath = path.join(rootDir, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

if (!serverContent.includes('.woff2')) {
  serverContent = serverContent.replace(
    "'.xml': 'application/xml; charset=UTF-8'",
    `'.xml': 'application/xml; charset=UTF-8',\n  '.woff2': 'font/woff2',\n  '.woff': 'font/woff',\n  '.ttf': 'font/ttf',\n  '.eot': 'application/vnd.ms-fontobject'`
  );
  fs.writeFileSync(serverPath, serverContent, 'utf8');
  console.log('✓ Updated server.js with font MIME types');
}

// 2. Scan and update all HTML files
function processDir(dir, isSubdir = false, isAdmin = false) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '_temp_analysis') continue;
      processDir(fullPath, true, entry.name === 'admin' || isAdmin);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');
      const cdnRegex = /<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^"']+\/css\/all\.min\.css["'][^>]*>/gi;

      if (cdnRegex.test(html)) {
        let localHref = 'css/all.min.css';
        if (isSubdir) {
          localHref = isAdmin ? 'css/all.min.css' : '../css/all.min.css';
        }
        const newTag = `<link rel="stylesheet" href="${localHref}">`;
        html = html.replace(cdnRegex, newTag);
        fs.writeFileSync(fullPath, html, 'utf8');
        console.log(`✓ Updated ${path.relative(rootDir, fullPath)} -> ${localHref}`);
      }
    }
  }
}

processDir(rootDir);
console.log('Finished updating all HTML files to local Font Awesome.');
