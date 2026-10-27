const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const wpcodeMatches = html.match(/class=["'][^"']*wpcode[^"']*["'][\s\S]*?<\/div>/gi) || [];
console.log('wpcode matches count:', wpcodeMatches.length);

// Let's find where wpcode or the HTML corresponding to that CSS is located
const htmlSnippetPos = html.indexOf('hero-grid');
if (htmlSnippetPos !== -1) {
  console.log('--- FOUND HERO-GRID SNIPPET ---');
  console.log(html.substring(htmlSnippetPos - 150, htmlSnippetPos + 4000));
}
