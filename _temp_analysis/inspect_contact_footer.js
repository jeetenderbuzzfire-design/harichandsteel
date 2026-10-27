const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

// Section 9 / Footer inside elementor
const pos = html.indexOf('Admin@HARICHANDSTEEL.COM');
console.log('Pos of Admin email:', pos);
if (pos !== -1) {
  console.log(html.substring(pos - 600, pos + 2500));
}
