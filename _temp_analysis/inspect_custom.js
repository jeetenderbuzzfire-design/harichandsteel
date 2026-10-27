const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Find where --ember or hero-stats appears
const idx = html.indexOf('--ember');
if (idx !== -1) {
  console.log('--- FOUND CUSTOM EMBED ---');
  console.log(html.substring(idx - 200, idx + 4000));
}
