const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'product-detail.html');
let html = fs.readFileSync(filePath, 'utf8');

html = html.replace('\n  </div>\r\n  </div>\r\n\r\n', '\n  </div>\r\n\r\n');
fs.writeFileSync(filePath, html, 'utf8');
console.log('Done!');
