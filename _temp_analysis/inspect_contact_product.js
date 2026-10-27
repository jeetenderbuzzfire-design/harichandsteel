const fs = require('fs');

const contactHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/contact.html', 'utf8');
const productHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/product.html', 'utf8');

console.log('=== CONTACT PAGE CONTENT ===');
const contactBody = contactHtml.match(/<main[\s\S]*?<\/main>/i) || contactHtml.match(/<div data-elementor-type=["']wp-page["'][\s\S]*?<\/footer>/i);
if (contactBody) {
  console.log(contactBody[0].replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 3000));
}

console.log('\n=== PRODUCT PAGE PRODUCTS ===');
const prodMatches = productHtml.match(/<li[^>]*class=["'][^"']*product\b[^"']*["'][\s\S]*?<\/li>/gi) || [];
console.log('Product items on product.html:', prodMatches.length);
for (let p of prodMatches.slice(0, 10)) {
  let title = (p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1];
  let link = (p.match(/href=["']([^"']*)["']/i) || [])[1];
  let img = (p.match(/data-src=["']([^"']*)["']/i) || p.match(/src=["']([^"']*)["']/i) || [])[1];
  let price = (p.match(/<span class=["']price["']>([\s\S]*?)<\/span>/i) || [])[1];
  console.log({ title: title ? title.replace(/<[^>]+>/g, '').trim() : '', link, img, price: price ? price.replace(/<[^>]+>/g, '').trim() : '' });
}
