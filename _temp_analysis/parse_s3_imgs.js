const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

const s3Start = body.indexOf('About Us');
const s4Start = body.indexOf('Client Testimonials');
const s3Chunk = body.substring(s3Start, s4Start);

const imgs = s3Chunk.match(/<img[^>]+>/gi) || [];
console.log('Images in About Us chunk:', imgs.length);
imgs.forEach(i => console.log(i));
