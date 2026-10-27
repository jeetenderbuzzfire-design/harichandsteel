const fs = require('fs');
const content = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/product_grid.html', 'utf8');

const items = content.split('class="wpr-grid-item-inner"');
console.log('Product items:', items.length - 1);
for (let i = 1; i < items.length; i++) {
  const item = items[i];
  const title = (item.match(/<h2[^>]*class=["'][^"']*elementor-heading-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) || item.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1];
  const cat = (item.match(/<span[^>]*class=["'][^"']*wpr-grid-item-category[^"']*["'][^>]*>([\s\S]*?)<\/span>/i) || [])[1];
  const link = (item.match(/href=["']([^"']*)["']/i) || [])[1];
  const img = (item.match(/data-src=["']([^"']*)["']/i) || item.match(/src=["']([^"']*)["']/i) || [])[1];
  console.log(`Product ${i}:`, {
    title: title ? title.replace(/<[^>]+>/g, '').trim() : null,
    category: cat ? cat.replace(/<[^>]+>/g, '').trim() : null,
    link,
    img
  });
}
