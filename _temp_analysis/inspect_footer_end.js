const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const pos = html.indexOf('Admin@HARICHANDSTEEL.COM');
console.log(html.substring(pos + 1000, pos + 3500).replace(/<svg[\s\S]*?<\/svg>/g, '[SVG]'));
