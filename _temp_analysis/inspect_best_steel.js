const fs = require('fs');

const raw = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/best-steel-gate-manufacturer-in-delhi.html', 'utf8');

const m1 = raw.match(/data-elementor-type=["']([^"']*)["']/g);
console.log('Elementor types in best-steel-gate:', m1);

const mainPos = raw.indexOf('<main');
if (mainPos !== -1) {
  console.log('Main snippet:');
  console.log(raw.substring(mainPos, mainPos + 1500).replace(/<svg[\s\S]*?<\/svg>/g, ''));
}
