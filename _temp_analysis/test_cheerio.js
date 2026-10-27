const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Let's parse all containers / elements
const cheerio = require('cheerio'); // wait, let's see if cheerio or jsdom is installed, or we can use regex
