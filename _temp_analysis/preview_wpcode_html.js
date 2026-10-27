const fs = require('fs');
const content = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/wpcode_extracted.html', 'utf8');

const styleEnd = content.indexOf('</style>');
const htmlPart = content.substring(styleEnd + 8);
console.log('HTML PART PREVIEW (first 4000 chars):');
console.log(htmlPart.substring(0, 4000));
