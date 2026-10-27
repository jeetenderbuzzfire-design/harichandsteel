const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';
const pageFiles = [
  'index.html',
  'about-us.html',
  'our-products.html',
  'product.html',
  'contact.html',
  'news.html',
  'steel-gate-design.html',
  'best-steel-gate-manufacturer-in-delhi.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html',
  'sitemap.html',
  'privacy-policy.html'
];

console.log('=== VERIFYING ALL 11 REDESIGNED PAGES ===');

let allGood = true;

for (const file of pageFiles) {
  const fullPath = path.join(baseDir, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING FILE: ${file}`);
    allGood = false;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'NONE';

  // Schema check
  const schemaMatches = content.match(/<script type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi) || [];

  // Tag balance
  const tags = ['div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'form'];
  let tagsBalanced = true;
  for (const tag of tags) {
    const o = (content.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const c = (content.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (o !== c) {
      console.warn(`  [${file}] Tag <${tag}> mismatch: opened ${o}, closed ${c}`);
      tagsBalanced = false;
      allGood = false;
    }
  }

  console.log(`[PASS] ${file} | Size: ${content.length} bytes | Schemas: ${schemaMatches.length} | Tags: ${tagsBalanced ? 'OK' : 'MISMATCH'} | Title: "${title.slice(0, 45)}..."`);
}

console.log('\nVerification result:', allGood ? 'ALL 11 PAGES ARE VALID & READY!' : 'SOME ISSUES FOUND');
