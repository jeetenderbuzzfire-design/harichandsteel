const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Find all slides in wpr-advanced-slider
const sliderMatches = html.match(/<div class="wpr-advanced-slider-slide[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi) || [];
console.log('Slider matches count:', sliderMatches.length);

// Let's find any text or images inside wpr-adv-slider
const advSlider = html.indexOf('wpr-advanced-slider');
if (advSlider !== -1) {
  const chunk = html.substring(advSlider - 200, advSlider + 8000);
  console.log('ADV SLIDER CHUNK:\n', chunk.replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG]'));
}

// Check google map embed
const mapPos = html.indexOf('google_maps');
if (mapPos !== -1) {
  console.log('MAP CHUNK:\n', html.substring(mapPos - 200, mapPos + 1000));
}
