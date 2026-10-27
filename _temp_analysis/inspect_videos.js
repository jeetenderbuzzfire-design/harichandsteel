const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const vid1 = html.indexOf('GTLyX-UQ3_w');
if (vid1 !== -1) {
  console.log('--- VID 1 CONTEXT ---');
  console.log(html.substring(vid1 - 400, vid1 + 500));
}

const vid2 = html.indexOf('g7WPvHU9Tv8');
if (vid2 !== -1) {
  console.log('--- VID 2 CONTEXT ---');
  console.log(html.substring(vid2 - 400, vid2 + 500));
}
