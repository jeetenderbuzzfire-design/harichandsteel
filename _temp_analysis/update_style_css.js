const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace in 1024px media query using regex
if (!css.includes('.cat-tile-detail {\r\n    padding: 24px 20px') && !css.includes('.cat-tile-detail {\n    padding: 24px 20px')) {
  css = css.replace(
    /(@media\s*\(\s*max-width:\s*1024px\s*\)\s*\{[\s\S]*?\.category-cards-grid\s*\{[\s\S]*?\})/,
    `$1\n\n  .cat-tile-detail {\n    padding: 24px 20px !important;\n  }\n\n  .cat-tile-title {\n    font-size: 1.25rem !important;\n  }`
  );
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Added 1024px responsive rule for .cat-tile-detail');
} else {
  console.log('1024px rule already present');
}
