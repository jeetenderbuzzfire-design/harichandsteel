const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const prodDetail = fs.readFileSync(path.join(rootDir, 'product-detail.html'), 'utf8');
const prod = fs.readFileSync(path.join(rootDir, 'product.html'), 'utf8');

const detailHeader = prodDetail.substring(prodDetail.indexOf('<body>'), prodDetail.indexOf('</header>') + 9);
const prodHeader = prod.substring(prod.indexOf('<body>'), prod.indexOf('</header>') + 9);

console.log('=== PRODUCT-DETAIL.HTML HEADER ===');
console.log(detailHeader);

console.log('\n=== PRODUCT.HTML HEADER ===');
console.log(prodHeader);
