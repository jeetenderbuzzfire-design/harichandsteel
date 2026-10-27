const fs = require('fs');
const content = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/product_grid.html', 'utf8');

const regex = /<div class="[^"]*grid-item[^"]*"[\s\S]*?<\/div>/gi;
console.log('Matches:', (content.match(/class=["'][^"']*grid-item[^"']*["']/gi) || []));
console.log('Sample content after wpr-grid:', content.substring(content.indexOf('wpr-grid elementor-clearfix'), content.indexOf('wpr-grid elementor-clearfix') + 3000));
