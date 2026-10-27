const fs = require('fs');
const path = require('path');

const rawDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages';
const files = [
  'our-products.html',
  'about-us.html',
  'product.html',
  'contact.html',
  'news.html',
  'steel-gate-design.html',
  'best-steel-gate-manufacturer-in-delhi.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html',
  'sitemap.html',
  'privacy-policy.html'
];

const results = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(rawDir, file), 'utf8');

  // Extract images
  const imgRegex = /<img\s+[^>]*>/gi;
  let m;
  const images = [];
  while ((m = imgRegex.exec(content)) !== null) {
    const tag = m[0];
    const src = (tag.match(/data-src=["']([^"']*)["']/) || tag.match(/src=["']([^"']*)["']/));
    const alt = tag.match(/alt=["']([^"']*)["']/);
    if (src && !src[1].startsWith('data:image') && !src[1].includes('cropped-HS-SIGN')) {
      images.push({ src: src[1], alt: alt ? alt[1] : '' });
    }
  }

  // Extract text blocks inside main/article/elementor
  const mainBlock = content.match(/<div data-elementor-type=["']wp-page["'][\s\S]*?<\/footer>/i) ||
                    content.match(/<div class=["']entry-content["'][\s\S]*?<\/div>/i) ||
                    content.match(/<main[\s\S]*?<\/main>/i);
  
  const text = mainBlock ? mainBlock[0].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') : '';

  // Extract headings
  const hRegex = /<(h[1-5])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  while ((m = hRegex.exec(text)) !== null) {
    let clean = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (clean) headings.push(`${m[1]}: ${clean}`);
  }

  // Extract paragraphs
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs = [];
  while ((m = pRegex.exec(text)) !== null) {
    let clean = m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (clean.length > 15 && !clean.includes('Copyright') && !clean.includes('Admin@HARICHANDSTEEL.COM')) {
      paragraphs.push(clean);
    }
  }

  results[file] = {
    images: Array.from(new Set(images.map(i => i.src))),
    headings,
    paragraphs
  };
}

fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/pages_content_details.json', JSON.stringify(results, null, 2));
console.log('Saved pages_content_details.json');
for (const file of files) {
  console.log(`\n=== ${file} ===`);
  console.log('Images count:', results[file].images.length);
  console.log('Headings:', results[file].headings);
  console.log('Paragraphs count:', results[file].paragraphs.length);
  if (results[file].paragraphs.length > 0) {
    console.log('First p:', results[file].paragraphs[0].slice(0, 150));
  }
}
