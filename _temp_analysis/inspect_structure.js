const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Let's find all elementor widgets and their contents
const widgetRegex = /<div[^>]*class=["'][^"']*elementor-widget-([^"'\s]+)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;

// Let's inspect sections in main content
const mainContentMatch = html.match(/<div class="elementor elementor-30[\s\S]*?<\/footer>/i) || html.match(/<div data-elementor-type="wp-page"[\s\S]*?<\/footer>/i);

const mainText = mainContentMatch ? mainContentMatch[0] : html;

// Let's find all images with their contexts
const imgMatches = [];
const imgRe = /<img\s+[^>]*>/gi;
let m;
while ((m = imgRe.exec(mainText)) !== null) {
  let tag = m[0];
  let src = (tag.match(/data-src=["']([^"']*)["']/) || tag.match(/src=["']([^"']*)["']/));
  let alt = tag.match(/alt=["']([^"']*)["']/);
  if (src && !src[1].startsWith('data:image')) {
    imgMatches.push({ src: src[1], alt: alt ? alt[1] : '' });
  }
}
console.log('--- ALL MAIN IMAGES ---');
console.log(JSON.stringify(imgMatches, null, 2));

// Let's find all heading texts and their hierarchy
const hMatches = [];
const hRe = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
while ((m = hRe.exec(mainText)) !== null) {
  hMatches.push({ tag: m[1], text: m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') });
}
console.log('\n--- ALL HEADINGS ---');
console.log(JSON.stringify(hMatches, null, 2));

// Let's find all buttons and links in main
const aRe = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
const aMatches = [];
while ((m = aRe.exec(mainText)) !== null) {
  let text = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  aMatches.push({ href: m[1], text: text });
}
console.log('\n--- ALL LINKS IN BODY ---');
console.log(JSON.stringify(aMatches, null, 2));
