const fs = require('fs');

const html = fs.readFileSync('our-products.html', 'utf8');

const regex = /<(h[1-4]|section|div[^>]*class="[^"]*cat-tile[^"]*")[^>]*>([\s\S]*?)<\/\1>/gi;
const matches = [];
let m;
const headingRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
while ((m = headingRegex.exec(html)) !== null) {
  console.log(`${m[1]}: ${m[2].trim().replace(/\s+/g, ' ').substring(0, 80)}`);
}
