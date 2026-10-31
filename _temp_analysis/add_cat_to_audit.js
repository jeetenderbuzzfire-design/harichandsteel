const fs = require('fs');
const path = require('path');

const auditPath = path.join(__dirname, 'audit_all_viewports_cdp.js');
let code = fs.readFileSync(auditPath, 'utf8');

if (!code.includes('/product-category/steel-door/')) {
  code = code.replace("'/product',", "'/product',\n  '/product-category/steel-door/',");
  fs.writeFileSync(auditPath, code, 'utf8');
  console.log('Added /product-category/steel-door/ to audit');
} else {
  console.log('Already in audit');
}
