const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\harichand-steel-redesign';

// Root HTML files
const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'admin.html');
rootFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('href="admin.html"')) {
    content = content.replace(/href="admin\.html"/g, 'href="admin/"');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated root ${file} -> href="admin/"`);
  }
});

// Mirror subdirectories
const mirrorDirs = [
  'about-us', 'aluminium-profile-gate-manufacturer-in-janakpuri', 'best-steel-gate-manufacturer-in-delhi',
  'contact', 'home', 'news', 'our-products', 'privacy-policy', 'product', 'sitemap', 'steel-gate-design'
];

mirrorDirs.forEach(dirName => {
  const file = path.join(rootDir, dirName, 'index.html');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/href="\.\.\/admin\.html"/g, 'href="../admin/"');
    content = content.replace(/href="admin\.html"/g, 'href="../admin/"');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated mirror ${dirName}/index.html -> href="../admin/"`);
  }
});
