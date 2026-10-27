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

let totalLive = 0;
files.forEach(f => {
  const content = fs.readFileSync(path.join(baseDir, f), 'utf8');
  const matches = content.match(/href=["'](https:\/\/harichandsteel\.com[^"']*)["']/g) || [];
  if (matches.length > 0) {
    console.log(`[${f}] Still has ${matches.length} live hrefs:`, matches);
    totalLive += matches.length;
  }
});

console.log(`Total live domain hrefs remaining: ${totalLive}`);
