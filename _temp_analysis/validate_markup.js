const fs = require('fs');

const indexHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/index.html', 'utf8');
const styleCss = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/css/style.css', 'utf8');
const mainJs = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/js/main.js', 'utf8');

console.log('HTML size:', indexHtml.length, 'bytes');
console.log('CSS size:', styleCss.length, 'bytes');
console.log('JS size:', mainJs.length, 'bytes');

// Check unclosed tags in HTML
const tags = ['div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'form'];
tags.forEach(tag => {
  const openCount = (indexHtml.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
  const closeCount = (indexHtml.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
  console.log(`Tag <${tag}>: opened ${openCount}, closed ${closeCount} -> ${openCount === closeCount ? 'BALANCED' : 'MISMATCH'}`);
});
