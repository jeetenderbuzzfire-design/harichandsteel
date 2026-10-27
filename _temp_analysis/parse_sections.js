const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

// Find all elements with class containing e-parent or elementor-top-section
const containerRegex = /<(div|section)[^>]*class=["'][^"']*(?:e-parent|elementor-top-section)[^"']*["'][^>]*>/gi;
let match;
const sectionStarts = [];
while ((match = containerRegex.exec(body)) !== null) {
  sectionStarts.push({ index: match.index, tag: match[0] });
}

console.log('Top level sections found:', sectionStarts.length);

for (let i = 0; i < sectionStarts.length; i++) {
  const start = sectionStarts[i].index;
  const end = (i < sectionStarts.length - 1) ? sectionStarts[i + 1].index : body.length;
  const chunk = body.substring(start, end);
  
  // Extract text, headings, images, links
  const headings = (chunk.match(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(h => h.replace(/<[^>]+>/g, '').trim());
  const paragraphs = (chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || []).map(p => p.replace(/<[^>]+>/g, '').trim());
  const links = (chunk.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi) || []).map(a => {
    let href = a.match(/href=["']([^"']*)["']/)[1];
    let text = a.replace(/<[^>]+>/g, '').trim();
    return `${text} -> ${href}`;
  });
  const imgs = (chunk.match(/data-src=["']([^"']*)["']|src=["'](https:[^"']*)["']/gi) || []);
  
  console.log(`\n================ SECTION ${i + 1} ================`);
  console.log('Headings:', headings);
  console.log('Paragraphs:', paragraphs);
  console.log('Links:', links);
  console.log('Images count:', imgs.length);
  // print if there are special elements like slick, video, iframe
  if (chunk.includes('slider')) console.log('[Contains Slider]');
  if (chunk.includes('video') || chunk.includes('youtu')) console.log('[Contains Video]');
  if (chunk.includes('google_maps') || chunk.includes('maps.google')) console.log('[Contains Google Map]');
  if (chunk.includes('testimonial')) console.log('[Contains Testimonial]');
  if (chunk.includes('woo-grid') || chunk.includes('product')) console.log('[Contains Product Grid]');
}
