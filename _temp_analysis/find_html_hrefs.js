const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const hrefs = new Set();
files.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const matches = content.matchAll(/href=["']([^"']*\.html[^"']*)["']/g);
  for (const m of matches) hrefs.add(m[1]);
});

console.log('Distinct .html href targets:');
console.log(Array.from(hrefs).sort());
