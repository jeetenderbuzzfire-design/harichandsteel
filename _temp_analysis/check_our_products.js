const fs = require('fs');

const prodHtml = fs.readFileSync('product.html', 'utf8');
const filterMatches = prodHtml.match(/data-filter="[^"]*"/g) || [];
console.log('Filters on product.html:');
console.log(filterMatches);

// Also check product cards on product.html
const cardCategories = (prodHtml.match(/data-category="[^"]*"/g) || []);
console.log('Categories on product cards in product.html:');
console.log([...new Set(cardCategories)]);

// Check our-products.html products section
const ourProdHtml = fs.readFileSync('our-products.html', 'utf8');
const ourProdCategories = (ourProdHtml.match(/data-category="[^"]*"/g) || []);
console.log('Categories on our-products.html:');
console.log([...new Set(ourProdCategories)]);
