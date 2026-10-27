const fs = require('fs');

const contactHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/contact.html', 'utf8');

const formPos = contactHtml.indexOf('wpr-form');
console.log('Form chunk:');
console.log(contactHtml.substring(formPos, formPos + 3500).replace(/<svg[\s\S]*?<\/svg>/g, ''));
