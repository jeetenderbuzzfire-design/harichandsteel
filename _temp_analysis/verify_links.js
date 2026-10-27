const fs = require('fs');

const origHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');
const newHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/index.html', 'utf8');

function extractHrefs(html) {
  const re = /href=["']([^"']*)["']/gi;
  let m;
  const hrefs = new Set();
  while ((m = re.exec(html)) !== null) {
    let h = m[1];
    if (h && !h.startsWith('#') && !h.startsWith('css/') && !h.startsWith('images/') && !h.startsWith('https://cdnjs') && !h.startsWith('https://fonts')) {
      hrefs.add(h);
    }
  }
  return Array.from(hrefs);
}

const origHrefs = extractHrefs(origHtml);
const newHrefs = extractHrefs(newHtml);

console.log('Original unique external/site hrefs:', origHrefs.length);
console.log('New unique external/site hrefs:', newHrefs.length);

const missing = origHrefs.filter(h => !newHrefs.includes(h));
console.log('Hrefs from original not in new:', missing);

const extra = newHrefs.filter(h => !origHrefs.includes(h));
console.log('Hrefs in new not in original:', extra);
