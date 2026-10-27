const fs = require('fs');

const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

console.log('--- BASIC INFO ---');
const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');

// Extract all links
const linkRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
let match;
const links = [];
while ((match = linkRegex.exec(html)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
    links.push({ href, text });
  }
}
console.log('\n--- UNIQUE LINKS (' + links.length + ' total) ---');
const uniqueLinks = Array.from(new Set(links.map(l => l.href + ' | ' + l.text)));
console.log(uniqueLinks.slice(0, 50).join('\n'));
if (uniqueLinks.length > 50) {
  console.log('... and ' + (uniqueLinks.length - 50) + ' more');
}

// Extract headers (h1, h2, h3)
const hRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
console.log('\n--- HEADINGS ---');
while ((match = hRegex.exec(html)) !== null) {
  const tag = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text) {
    console.log(`${tag}: ${text}`);
  }
}

// Extract phone numbers and emails
const phoneMatches = html.match(/(\+?\d[\d\s-]{8,}\d)/g) || [];
console.log('\n--- POTENTIAL PHONES ---');
console.log(Array.from(new Set(phoneMatches.map(p => p.trim()))).slice(0, 10));

const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('\n--- EMAILS ---');
console.log(Array.from(new Set(emailMatches)));
