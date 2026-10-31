const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const categoryMap = [
  { oldPattern: /(?:our-products\.html|product\.html)#aluminum-profile-gate\b/g, newUrl: '/product-category/aluminum-profile-gate/' },
  { oldPattern: /(?:our-products\.html|product\.html)#iron-main-gate\b/g, newUrl: '/product-category/iron-main-gate/' },
  { oldPattern: /(?:our-products\.html|product\.html)#steel-main-gate\b/g, newUrl: '/product-category/steel-main-gate/' },
  { oldPattern: /(?:our-products\.html|product\.html)#steel-door\b/g, newUrl: '/product-category/steel-door/' },
  { oldPattern: /(?:our-products\.html|product\.html)#powder-coated-gates\b/g, newUrl: '/product-category/powder-coated-gates/' }
];

let totalReplacements = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;

  categoryMap.forEach(({ oldPattern, newUrl }) => {
    const matches = content.match(oldPattern);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(oldPattern, newUrl);
    }
  });

  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}: ${fileReplacements} category links replaced.`);
    totalReplacements += fileReplacements;
  }
});

console.log(`\nTotal category link replacements across HTML files: ${totalReplacements}`);
