const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Find all top-level sections or containers inside elementor-30 (page body)
const bodyStart = html.indexOf('data-elementor-type="wp-page"');
const bodyEnd = html.indexOf('</main>');
const mainHtml = html.substring(bodyStart, bodyEnd > 0 ? bodyEnd : html.length);

// Let's write mainHtml to a file to examine clearly
fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', mainHtml);
console.log('Main Elementor body length:', mainHtml.length);
