const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const faqPos = html.indexOf('faq');
console.log('FAQ pos:', faqPos);
if (faqPos !== -1) {
  console.log(html.substring(faqPos - 100, faqPos + 1000));
}

const statPos = html.indexOf('stat-num');
console.log('stat-num pos:', statPos);
if (statPos !== -1) {
  console.log(html.substring(statPos - 100, statPos + 1000));
}
