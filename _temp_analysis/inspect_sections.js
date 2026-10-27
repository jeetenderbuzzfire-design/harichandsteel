const fs = require('fs');

const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Let's inspect sections or elementor containers
const sectionRegex = /<(section|div)[^>]*(data-elementor-type|elementor-section|elementor-element)[^>]*>([\s\S]*?)<\/\1>/gi;

// Let's search for all text nodes that have meaningful content
const cheerioLike = (html) => {
  // Strip scripts and styles
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  return clean;
};

const clean = cheerioLike(html);

// Find all headings and their following sibling texts
const matches = clean.match(/<(h[1-6]|p|div|span|a)[^>]*class=["'][^"']*(elementor-heading-title|elementor-image-box-title|elementor-image-box-description|elementor-icon-box-title|elementor-icon-box-description|elementor-testimonial|testimonial|elementor-post__title)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi) || [];

console.log('--- FOUND ELEMENTOR TEXT BLOCKS (' + matches.length + ') ---');
for (let m of matches) {
  let text = m.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text) {
    console.log(text);
  }
}

// Let's also look for all text inside wp-block or elementor-widget-wrap
const widgets = clean.match(/class=["'][^"']*elementor-widget-([a-zA-Z0-9-]+)[^"']*["']/gi) || [];
console.log('\n--- ELEMENTOR WIDGET TYPES ---');
console.log(Array.from(new Set(widgets.map(w => w))));
