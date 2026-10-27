const fs = require('fs');
const content = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/product_grid.html', 'utf8');

const regex = /<article[\s\S]*?<\/article>/gi;
const articles = content.match(regex) || [];
console.log('Articles count:', articles.length);
articles.forEach((a, idx) => {
  console.log(`\n--- Article ${idx + 1} ---`);
  console.log(a.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, ''));
});
