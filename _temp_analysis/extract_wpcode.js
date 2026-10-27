const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Find all style and html between wpcode tags or custom section
const start = html.indexOf('<style class="wpcode-css-snippet">');
if (start !== -1) {
  // find end of snippet
  const snippet = html.substring(start, start + 30000);
  fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/wpcode_extracted.html', snippet);
  console.log('Saved wpcode_extracted.html, length:', snippet.length);
} else {
  console.log('wpcode-css-snippet not found');
}
