const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const pos = html.indexOf('58696b38');
console.log(html.substring(pos, pos + 2500).replace(/<svg[\s\S]*?<\/svg>/g, '[SVG]'));
