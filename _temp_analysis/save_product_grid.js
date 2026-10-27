const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

const pGridPos = body.indexOf('wpr-woo-grid');
const chunk = body.substring(pGridPos, pGridPos + 10000);

fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/product_grid.html', chunk);
console.log('Saved product_grid.html');
