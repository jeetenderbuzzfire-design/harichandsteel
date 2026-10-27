const fs = require('fs');

const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Check videos
const videoMatches = html.match(/<iframe[^>]*src=["']([^"']*)["'][^>]*>|<video[^>]*>([\s\S]*?)<\/video>|data-settings=["']([^"']*)["']/gi) || [];
console.log('--- VIDEO DATA ---');
for (let v of videoMatches) {
  if (v.includes('youtube') || v.includes('vimeo') || v.includes('video') || v.includes('aspect_ratio')) {
    console.log(v);
  }
}

// Check slider content
const sliderMatch = html.match(/class=["'][^"']*wpr-advanced-slider[^"']*["'][\s\S]*?<\/section>/i) || html.match(/class=["'][^"']*wpr-advanced-slider[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
if (sliderMatch) {
  console.log('\n--- SLIDER CONTENT PREVIEW ---');
  console.log(sliderMatch[0].slice(0, 1500));
}

// Check Google Map iframe
const mapMatch = html.match(/<iframe[^>]*src=["'][^"']*google\.com\/maps[^"']*["'][^>]*>/i);
console.log('\n--- GOOGLE MAP ---');
console.log(mapMatch ? mapMatch[0] : 'No map iframe found directly, searching embed:');
const anyIframe = html.match(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi) || [];
for (let f of anyIframe) {
  console.log('Iframe:', f);
}

// Check navigation menu exact items
const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi) || [];
console.log('\n--- NAV MENUS (' + navMatch.length + ') ---');
for (let n of navMatch) {
  console.log(n);
}
