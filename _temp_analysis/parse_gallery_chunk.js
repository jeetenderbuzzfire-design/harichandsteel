const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

console.log('=== CHUNK 8000 to 18000 ===');
const chunk = body.substring(8000, 18500);
// strip svgs
console.log(chunk.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, '').substring(0, 3000));
