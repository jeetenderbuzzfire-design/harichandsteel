const fs = require('fs');

const raw1 = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/steel-gate-design.html', 'utf8');
const raw2 = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/best-steel-gate-manufacturer-in-delhi.html', 'utf8');
const raw3 = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/aluminium-profile-gate-manufacturer-in-janakpuri.html', 'utf8');

function getCleanContent(html) {
  const match = html.match(/<div class=["']entry-content[\s\S]*?<\/div><!-- \.entry-content/i) || html.match(/<div data-elementor-type=["']wp-post["'][\s\S]*?<\/footer>/i);
  return match ? match[0] : '';
}

console.log('steel-gate-design content length:', getCleanContent(raw1).length);
console.log('best-steel-gate-manufacturer content length:', getCleanContent(raw2).length);
console.log('aluminium-profile-gate-janakpuri content length:', getCleanContent(raw3).length);
