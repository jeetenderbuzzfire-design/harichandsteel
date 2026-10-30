const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

const directories = [
  { folder: 'home', source: 'index.html' },
  { folder: 'about-us', source: 'about-us.html' },
  { folder: 'our-products', source: 'our-products.html' },
  { folder: 'product', source: 'product.html' },
  { folder: 'contact', source: 'contact.html' },
  { folder: 'news', source: 'news.html' },
  { folder: 'steel-gate-design', source: 'steel-gate-design.html' },
  { folder: 'best-steel-gate-manufacturer-in-delhi', source: 'best-steel-gate-manufacturer-in-delhi.html' },
  { folder: 'aluminium-profile-gate-manufacturer-in-janakpuri', source: 'aluminium-profile-gate-manufacturer-in-janakpuri.html' },
  { folder: 'sitemap', source: 'sitemap.html' },
  { folder: 'privacy-policy', source: 'privacy-policy.html' }
];

for (const d of directories) {
  const dirPath = path.join(baseDir, d.folder);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const sourceContent = fs.readFileSync(path.join(baseDir, d.source), 'utf8');

  // Fix relative paths for files in subfolder (e.g. ./css/style.css -> .././css/style.css, images/ -> ../images/, js/ -> ../js/)
  const adjustedContent = sourceContent
    .replace(/(href|src)=["']css\//g, '$1="../css/')
    .replace(/(href|src)=["']images\//g, '$1="../images/')
    .replace(/(href|src)=["']js\//g, '$1="../js/');

  fs.writeFileSync(path.join(dirPath, 'index.html'), adjustedContent, 'utf8');
}

console.log('Created directory mirror index.html files for all routes.');
