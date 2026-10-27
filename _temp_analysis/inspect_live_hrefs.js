const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

const files = [
  'index.html',
  'about-us.html',
  'our-products.html',
  'product.html',
  'contact.html',
  'news.html',
  'steel-gate-design.html',
  'best-steel-gate-manufacturer-in-delhi.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html',
  'sitemap.html',
  'privacy-policy.html'
];

const found = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(baseDir, f), 'utf8');
  const matches = content.match(/href=["'](https:\/\/harichandsteel\.com[^"']*)["']/g) || [];
  found[f] = matches.map(m => m.replace(/href=["']|["']/g, ''));
});

console.log('--- FOUND INTERNAL LIVE URLS IN HREF ATTRIBUTES ---');
for (const f in found) {
  const unique = Array.from(new Set(found[f]));
  console.log(`\n${f} (${unique.length} unique live hrefs):`);
  console.log(unique.join('\n'));
}
