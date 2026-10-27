const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

const pos = body.indexOf('0a01193');
const chunk = body.substring(pos, pos + 12000);

const imgs = chunk.match(/data-src=["']([^"']*)["']/g) || [];
console.log('Images in 0a01193:', imgs);

const texts = chunk.match(/<(h[1-6]|p)[^>]*>([\s\S]*?)<\/\1>/g) || [];
console.log('Texts in 0a01193:', texts.map(t => t.replace(/<[^>]+>/g, '').trim()));
