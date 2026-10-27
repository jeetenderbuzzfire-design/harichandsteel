const fs = require('fs');
const content = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/product_grid.html', 'utf8');
console.log(content.substring(0, 1500));
