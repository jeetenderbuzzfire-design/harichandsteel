const fs = require('fs');

const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Find all images
const imgRegex = /<img\s+[^>]*src=["']([^"']*)["'][^>]*>/gi;
let match;
const images = [];
while ((match = imgRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const src = match[1];
  const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
  images.push({ src, alt: altMatch ? altMatch[1] : '' });
}

console.log('--- IMAGES (' + images.length + ') ---');
const uniqueImgs = Array.from(new Set(images.map(img => `${img.src} | ${img.alt}`)));
console.log(uniqueImgs.join('\n'));

// Let's extract sections and readable paragraphs
const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
console.log('\n--- PARAGRAPHS ---');
const paragraphs = [];
while ((match = pRegex.exec(html)) !== null) {
  const text = match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text.length > 10) {
    paragraphs.push(text);
  }
}
const uniquePs = Array.from(new Set(paragraphs));
console.log(uniquePs.join('\n\n'));
