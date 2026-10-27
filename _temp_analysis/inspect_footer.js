const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const footerIndex = html.indexOf('<footer');
if (footerIndex !== -1) {
  console.log('--- FOOTER HTML ---');
  console.log(html.substring(footerIndex, footerIndex + 8000));
}
