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

  let content = fs.readFileSync(path.join(baseDir, d.source), 'utf8');

  // Adjust asset paths
  content = content
    .replace(/(href|src)=["']css\//g, '$1="../css/')
    .replace(/(href|src)=["']images\//g, '$1="../images/')
    .replace(/(href|src)=["']js\//g, '$1="../js/');

  // Adjust local html links so from inside subfolder they go up one level (e.g. href="about-us.html" -> href="../about-us.html")
  const htmlFiles = [
    'index.html',
    'about-us.html',
    'our-products.html',
    'product.html',
    'contact.html',
    'news.html',
    'steel-gate-design.html',
    'best-steel-gate-manufacturer-in-delhi.html',
    'aluminium-profile-gate-manufacturer-in-janakpuri.html',
    'sitemap.html',
    'privacy-policy.html'
  ];

  htmlFiles.forEach(hf => {
    // replace href="about-us.html" with href="../about-us.html"
    const re = new RegExp(`href=["']${hf}([^"']*)["']`, 'g');
    content = content.replace(re, `href="../${hf}$1"`);
  });

  fs.writeFileSync(path.join(dirPath, 'index.html'), content, 'utf8');
}

console.log('Updated directory mirrors with local relative paths.');
